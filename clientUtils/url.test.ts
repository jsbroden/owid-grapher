#! /usr/bin/env jest

import { mapValues } from "lodash"
import { queryParamsToStr, strToQueryParams } from "./url"

const testCases = [
    {
        queryStr: "?foo=bar",
        params: { foo: { _original: "bar", decoded: "bar" } },
    },
    {
        queryStr: "?foo=bar&baz=false&bar=0",
        params: {
            foo: { _original: "bar", decoded: "bar" },
            baz: { _original: "false", decoded: "false" },
            bar: { _original: "0", decoded: "0" },
        },
    },
    {
        queryStr: "?country=East+Asia+%26+Pacific",
        params: {
            country: {
                _original: "East+Asia+%26+Pacific",
                decoded: "East Asia & Pacific",
            },
        },
    },
    {
        queryStr: "?country=East%20Asia%20%26%20Pacific",
        params: {
            country: {
                _original: "East%20Asia%20%26%20Pacific",
                decoded: "East Asia & Pacific",
            },
        },
        ignoreInToQueryStrTest: true,
    },
    {
        queryStr: "?foo=%2526",
        params: { foo: { _original: "%2526", decoded: "%26" } },
    },
    { queryStr: "?foo=", params: { foo: { _original: "", decoded: "" } } },
    {
        queryStr: "?foo",
        params: {},
        ignoreInToQueryStrTest: true,
    },
]

describe(queryParamsToStr, () => {
    for (const testCase of testCases) {
        if (testCase.ignoreInToQueryStrTest) continue

        it(`can convert query params to a query string: '${testCase.queryStr}'`, () => {
            expect(
                queryParamsToStr(mapValues(testCase.params, (p) => p?.decoded))
            ).toEqual(testCase.queryStr)
        })
    }
})

describe(strToQueryParams, () => {
    for (const testCase of testCases) {
        it(`can convert query string to a query params object: '${testCase.queryStr}'`, () => {
            expect(strToQueryParams(testCase.queryStr)).toEqual(testCase.params)
        })
    }
})
