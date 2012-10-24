create sample config file config.json (do not check in github!)

```
{
  configs: {
    "hostname": "HOSTNAME",
    "port": EXPORTED_PORT_USING_IPTABLES,
    "internalPort": PORT_LISTEN_TO,
    "clientId": "FROM_GITHUB",
    "clientSecret": "FROM_GITHUB",
    "entryPath": "/auth/github",
    "callbackPath": "/auth/github/callback",
  }
}
```