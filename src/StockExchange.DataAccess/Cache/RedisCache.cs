﻿using log4net;
using Newtonsoft.Json;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StockExchange.DataAccess.Cache
{
    /// <summary>
    /// Cache implementation for Redis
    /// </summary>
    public class RedisCache : ICache
    {
        private static readonly ILog log = LogManager.GetLogger(typeof(RedisCache));

        private static Lazy<ConnectionMultiplexer> _lazyRedisConnection;
        private static ConnectionMultiplexer _redisConnection => _lazyRedisConnection.Value;

        private readonly IRedisSettings _settings;
        private IDatabase _db => _redisConnection.GetDatabase(_settings.DatabaseNumber);

        /// <summary>
        /// Creates a new instance of <see cref="RedisCache"/>
        /// </summary>
        /// <param name="settings">The Redis connection settings</param>
        public RedisCache(IRedisSettings settings)
        {
            _settings = settings;
            _lazyRedisConnection  = new Lazy<ConnectionMultiplexer>(() => ConnectionMultiplexer.Connect(settings.ConnectionString), true);
        }

        /// <inheritdoc />
        public async Task<T> Get<T>(string key)
        {
            try
            {
                var redisObject = await _db.StringGetAsync(key);
                if (redisObject.HasValue)
                {
                    return JsonConvert.DeserializeObject<T>(redisObject);
                }
            }
            catch (RedisConnectionException e)
            {
                log.Error("Redis connection error", e);
            }
            return default(T);
        }

        /// <inheritdoc />
        public async Task Set<T>(string key, T objectToCache)
        {
            string serializedObject = JsonConvert.SerializeObject(objectToCache);
            try
            {
                await _db.StringSetAsync(key, serializedObject);
            }
            catch (RedisConnectionException e)
            {
                log.Error("Redis connection error", e);
            }
        }

        /// <inheritdoc />
        public async Task<bool> Remove(string key)
        {
            return await _db.KeyDeleteAsync(key);
        }

        /// <inheritdoc />
        public async Task<long> Remove(IEnumerable<string> keys)
        {
            return await _db.KeyDeleteAsync(keys.Select(key => (RedisKey)key).ToArray());
        }

        /// <inheritdoc />
        public async Task Flush()
        {
            var endpoints = _redisConnection.GetEndPoints(true);
            foreach (var endpoint in endpoints)
            {
                var server = _redisConnection.GetServer(endpoint);
                await server.FlushAllDatabasesAsync();
            }
        }

    }
}