curl http://127.0.0.1:3000/
curl http://127.0.0.1:3000/api
curl -X POST http://127.0.0.1:3000/api -H "Content-Type: application/json" -d '{"creditorName":"EXAMPLE_CREDITOR","firstName":"EXAMPLE_FIRSTNAME","lastName":"EXAMPLE_LASTNAME","minPaymentPercentage":2,"balance":1363}'
curl -X DELETE http://127.0.0.1:3000/api 
