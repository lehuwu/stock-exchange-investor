﻿using FluentAssertions;
using Moq;
using StockExchange.Business.Exceptions;
using StockExchange.Business.Models.Strategy;
using StockExchange.Business.ServiceInterfaces;
using StockExchange.Business.Services;
using StockExchange.DataAccess.IRepositories;
using StockExchange.DataAccess.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using StockExchange.Business.Indicators;
using StockExchange.Business.Indicators.Common;
using StockExchange.DataAccess.Repositories;
using Xunit;

namespace StockExchange.UnitTest.Services
{
    public class StrategyServiceTests
    {
        private readonly IStrategyService _service;
        private readonly Mock<IRepository<InvestmentStrategy>> _strategyRepository = new Mock<IRepository<InvestmentStrategy>>();
        private readonly IIndicatorsService _indicatorsService;

        private readonly IList<InvestmentStrategy> _strategies = new List<InvestmentStrategy>
        {
            new InvestmentStrategy
            {
                Id = 1,
                UserId = 1,
                Name = "Strategy1"
            }
        };

        public StrategyServiceTests()
        {
            _indicatorsService = new IndicatorsService(new IndicatorFactory(), new PriceService(new Mock<IRepository<Price>>().Object));
            _service = new StrategyService(_strategyRepository.Object, _indicatorsService);
            _strategyRepository.Setup(s => s.GetQueryable(null, null, null, null, null))
                .Returns(_strategies.AsQueryable());
        }

        [Fact]
        public void When_user_already_has_strategy_with_given_name_should_throw()
        {
            var newStrategy = new StrategyDto
            {
                Name = "Strategy1",
                UserId = 1
            };

            Action act = () => _service.CreateStrategy(newStrategy);

            act.ShouldThrow<BusinessException>();
        }
    }
}