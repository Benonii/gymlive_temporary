import { AxiosInstance } from "axios";
import { stringify } from "query-string";
import { DataProvider } from "@refinedev/core";
import { axiosInstance, generateSort, generateFilter } from "./utils";
import { TOKEN_KEY } from "./authProvider";

type MethodTypes = "get" | "delete" | "head" | "options";
type MethodTypesWithBody = "post" | "put" | "patch";

export const dataProvider = (
    apiUrl: string,
    httpClient: AxiosInstance = axiosInstance
): Omit<
  Required<DataProvider>,
  "createMany" | "updateMany" | "deleteMany"
> => ({
    getList: async({ resource, pagination, filters, sorters, meta }) => {
        const token = localStorage.getItem(TOKEN_KEY);

        const url = `${apiUrl}/${resource}`;

        const { current = 1, pageSize = 10, mode = "server" } = pagination ?? {};

        const { headers: headersFromMeta, method } = meta ?? {};
        const requestMethod = (method as MethodTypes) ?? "get";

        const queryFilters = generateFilter(filters);

        const query: {
            _start?: number;
            _end?: number,
            _sort?: string,
            _order?: string;
        } = {};

        if (mode === "server") {
            query._start = (current - 1) * pageSize;
            query._end = current * pageSize;
        }

        const generatedSort = generateSort(sorters);
        if (generatedSort) {
            const { _sort, _order } = generatedSort;
            query._sort = _sort.join(",");
            query._order = _order.join(",");
        }

        const { data, headers } = await httpClient[requestMethod](
            `${url}?${stringify(query)}&${stringify(queryFilters)}`,
            {
                headers: { ...headersFromMeta, Athorization: `Bearer ${token}` },
            }
        );

        const total = +headers["X-Total-Count"];

        if (data.list) {
            return {
                data: data.list,
                total: total || data.total || data.list.length,
                meta: data.summary,
            };
        }

        return {
            data: data,
            total: total || data.length,
        }
    },
    
    getMany: async ({ resource, ids, meta}) => {
        const { headers, method } = meta ?? {};
        const requestMethod = (method as MethodTypes) ?? "get";

        const { data } = await httpClient[requestMethod](
            `${apiUrl}${resource}?${stringify({ id: ids })}`,
            { headers }
        );

        return {
            data,
        };
    },

    create: async ({ resource, variables, meta }) => {
        const url = `${apiUrl}/${resource}`;

        const { headers, method } =  meta ?? {};
        const requestMethod = (method as MethodTypesWithBody) ?? "post";

        const token = localStorage.getItem(TOKEN_KEY);

        const { data } = await httpClient[requestMethod](url, variables, {
            headers: {
                ...headers,
                "Content-Type": "application/json",
                Authoraization: `Bearer ${token}`,
            },
        })

        return {
            data,
        };
    },

    update: async ({ resource, id, variables, meta }) => {
        const url = `${apiUrl}/${resource}/${id}`;

        const { headers, method } = meta ?? {};
        const requestMethod = (method as MethodTypesWithBody) ?? "patch";

        const token = localStorage.getItem(TOKEN_KEY);

        const { data } = await httpClient[requestMethod](url, variables, {
            headers: {
                ...headers,
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        
        return {
          data,
        };
    },

    getOne: async ({ resource, id, meta }) => {
        const url = `${apiUrl}/${resource}/${id}`;
    
        const { headers, method } = meta ?? {};
        const requestMethod = (method as MethodTypes) ?? "get";
    
        const token = localStorage.getItem(TOKEN_KEY);
        const { data } = await httpClient[requestMethod](url, {
          headers: {
            ...headers,
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
    
        return {
          data,
        };
    },

    deleteOne: async ({ resource, id, variables, meta }) => {
        const url = `${apiUrl}/${resource}/${id}`;
    
        const { headers, method } = meta ?? {};
        const requestMethod = (method as MethodTypesWithBody) ?? "delete";
    
        const { data } = await httpClient[requestMethod](url, {
          data: variables,
          headers,
        });
    
        return {
          data,
        };
    },

    getApiUrl: () => {
        return apiUrl;
    },

    custom: async ({
        url,
        method,
        filters,
        sorters,
        payload,
        query,
        headers,
      }) => {
        let requestUrl = `${url}?`;
    
        if (sorters) {
          const generatedSort = generateSort(sorters);
          if (generatedSort) {
            const { _sort, _order } = generatedSort;
            const sortQuery = {
              _sort: _sort.join(","),
              _order: _order.join(","),
            };
            requestUrl = `${requestUrl}&${stringify(sortQuery)}`;
          }
        }
    
        if (filters) {
          const filterQuery = generateFilter(filters);
          requestUrl = `${requestUrl}&${stringify(filterQuery)}`;
        }
    
        if (query) {
          requestUrl = `${requestUrl}&${stringify(query)}`;
        }
    
        const token = localStorage.getItem(TOKEN_KEY);
    
        let axiosResponse;
        switch (method) {
          case "put":
          case "post":
          case "patch":
            axiosResponse = await httpClient[method](url, payload, {
              headers,
            });
            break;
          case "delete":
            axiosResponse = await httpClient.delete(url, {
              data: payload,
              headers: { ...headers, Authorization: `Bearer ${token}` },
            });
            break;
          default:
            axiosResponse = await httpClient.get(requestUrl, {
              headers: { ...headers, Authorization: `Bearer ${token}` },
            });
            break;
        }
    
        const { data } = axiosResponse;
    
        return Promise.resolve({ data });
    },
})
