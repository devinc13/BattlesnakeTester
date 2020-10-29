# BattlesnakeTester

There are 2 sets of tests (normal and hard). Normal tests should be cases where failing the test results in you dying or a very high chance of death. Hard tests can be special situations where certain moves might be arguably better than others, but don't necessairly mean certain death. Hard tests often involve more looking ahead or prediction.

Need to add the sleep module first : `npm install sleep`

To run normal tests: `npm --host=localhost --port=8000 run test`

or: `npm --host=snake.com run test`

For hard tests, replace `test` with `hard_test`. Eg. `npm --host=localhost --port=8000 run hard_test`
