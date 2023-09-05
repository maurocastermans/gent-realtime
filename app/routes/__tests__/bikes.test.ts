import { loader } from "../bikes";
import { Station } from "../bikes";

describe("bikes loader", () => {
  let data: Array<Station>;
  let result: Response;

  beforeAll(async () => {
    const request = new Request("http://foo.bar");

    result = await loader({
      request,
      context: {},
      params: {},
    });

    data = await result.json();
  });

  it("happy path: returns 200 when stations found", async () => {
    expect(result.status).toEqual(200);
  });

  it("happy path: returns correct first station name", async () => {
    expect(data[0].name === "Station Gent-Dampoort");
  });

  it("happy path: returns correct second station name", async () => {
    expect(data[1].name === "Station Gent-St. P. (M. Hendrikaplein)");
  });

  it("happy path: returns correct number of stations found", async () => {
    let nrOfStations: number = 0;
    data.forEach(() => (nrOfStations += 1));
    expect(nrOfStations).toEqual(2);
  });
});
