import { api } from "../shared/services/service";

describe("ApiService", () => {
  beforeEach(() => (globalThis.fetch = jest.fn()));

  afterEach(() => jest.restoreAllMocks());

  describe("getInstance", () => {
    it("should always return the same instance", () => {
      const firstInstance = api;
      const secondInstance = api;

      expect(firstInstance).toBe(secondInstance);
    });
  });

  describe("get", () => {
    it("should perform a GET request and return parsed JSON data", async () => {
      const mockData = { id: 1, name: "Test" };

      (globalThis.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const response = await api.get<{ id: number; name: string }>("/test");

      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/test",
        expect.objectContaining({ method: "GET" }),
      );
      expect(response).toEqual(mockData);
    });

    it("should append pagination query strings when pagination parameters are provided", async () => {
      (globalThis.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([]),
      });

      await api.get("/test", { page: 2, pageSize: 20 });

      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/test?page=2&pageSize=20",
        expect.objectContaining({ method: "GET" }),
      );
    });

    it("should throw an IApiError when the response falls out of the success range", async () => {
      const errorMessage = "Internal Server Error";

      (globalThis.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
        text: () => Promise.resolve(errorMessage),
      });

      await expect(api.get("/test")).rejects.toEqual({
        message: errorMessage,
        status: 500,
      });
    });
  });

  describe("post", () => {
    it("should perform a POST request passing the payload as JSON string", async () => {
      const payload = { title: "New Item" };
      const mockResult = { success: true };

      (globalThis.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResult),
      });

      const response = await api.post("/create", payload);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/create",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(payload),
        }),
      );
      expect(response).toEqual(mockResult);
    });
  });

  describe("put", () => {
    it("should perform a PUT request passing the payload as JSON string", async () => {
      const payload = { title: "Updated Item" };
      const mockResult = { success: true };

      (globalThis.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResult),
      });

      const response = await api.put("/update", payload);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/update",
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify(payload),
        }),
      );
      expect(response).toEqual(mockResult);
    });
  });

  describe("delete", () => {
    it("should perform a DELETE request without body when data is omitted", async () => {
      const mockResult = { deleted: true };

      (globalThis.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResult),
      });

      const response = await api.delete("/remove/1");

      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/remove/1",
        expect.objectContaining({
          method: "DELETE",
          body: undefined,
        }),
      );
      expect(response).toEqual(mockResult);
    });

    it("should perform a DELETE request providing a body when payload data is sent", async () => {
      const payload = { cascade: true };
      const mockResult = { deleted: true };

      (globalThis.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResult),
      });

      const response = await api.delete("/remove/1", payload);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/remove/1",
        expect.objectContaining({
          method: "DELETE",
          body: JSON.stringify(payload),
        }),
      );
      expect(response).toEqual(mockResult);
    });
  });
});
