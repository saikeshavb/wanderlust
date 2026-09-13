import http from "k6/http";
import { check } from "k6";

export const options = {
    scenarios: {
        listings_25vus: {
            executor: "constant-vus",
            vus: 25,
            duration: "60s",
        },
    },
};

export default function () {
    const response = http.get("http://localhost:8080/listings");

    check(response, {
        "status is 200": (r) => r.status === 200,
    });
}