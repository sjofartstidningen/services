# Sjöfartstidningen Services

A set of serverless services for Sjöfartstidningen

## Deployment

```sh
# Command when whole stack updated
yarn deploy --stage production --aws-profile sst

# Command when single function updated
yarn deploy:fn -f [name] --stage production --aws-profile sst
```
