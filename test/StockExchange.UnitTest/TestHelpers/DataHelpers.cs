﻿using FluentAssertions;
using StockExchange.Business.Models.Indicators;
using StockExchange.DataAccess.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace StockExchange.UnitTest.TestHelpers
{
    internal class DataHelper
    {
        internal static readonly DateTime StartDate = new DateTime(2015, 11, 1);

        internal static IList<IndicatorValue> ConvertToIndicatorValues(decimal[] tab, int offset = 0)
        {
            return tab.Select((t, i) => new IndicatorValue
            {
                Value = t,
                Date = StartDate.AddDays(i + offset)
            }).ToList();
        }

        // the order is High, Low, Close, Volume(optional)
        internal static IList<Price> ConvertToPrices(decimal[,] tab, int offset = 0)
        {
            var prices = new List<Price>();
            for (int i = 0; i < tab.GetLength(0); i++)
            {
                var item = new Price
                {
                    Date = StartDate.AddDays(i + offset),
                    HighPrice = tab[i, 0],
                    LowPrice = tab[i, 1],
                    ClosePrice = tab[i, 2]
                };
                if (tab.GetLength(1) > 3)
                    item.Volume = (int)tab[i, 3];

                prices.Add(item);
            }
            return prices;
        }

        internal static IList<Price> ConvertToPrices(decimal[] tab, int offset = 0)
        {
            return tab.Select((t, i) => new Price
            {
                ClosePrice = t,
                Date = StartDate.AddDays(i + offset)
            }).ToList();
        }

        internal static IList<Price> ConvertToPricesVolume(int[] tab, int offset = 0)
        {
            return tab.Select((t, i) => new Price
            {
                Volume = t,
                Date = StartDate.AddDays(i + offset)
            }).ToList();
        }

        internal static void SetPrecisionForDecimal(int precision)
        {
            AssertionOptions.AssertEquivalencyUsing(options =>
                options.Using<decimal>(ctx => ctx.Subject.Should()
                .BeApproximately(ctx.Expectation, precision)).WhenTypeIs<decimal>());
        }
    }
}
