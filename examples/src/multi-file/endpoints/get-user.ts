import { api, endpoint, pathParam } from "@zenclabs/api";

@api()
export class Api {
  @endpoint({
    method: "GET",
    path: "/users/:userId"
  })
  getUser(
    @pathParam userId: string
  ): Promise<{
    name: string;
    age?: number;
  }> {
    throw new Error("Not implemented");
  }
}