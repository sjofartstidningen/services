# Sjöfartstidningen Services

A set of serverless services for Sjöfartstidningen

## Deployment

Make sure access and secret keys are defined in `.env` then run one of the following.

```sh
# Command when whole stack updated
STAGE=production yarn deploy

# Command when single function updated
STAGE=production yarn deploy:fn -f [name]
```
