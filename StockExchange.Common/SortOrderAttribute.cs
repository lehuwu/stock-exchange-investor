﻿using System;

namespace StockExchange.Common
{
    [AttributeUsage(AttributeTargets.Property)]
    public sealed class SortOrderAttribute : Attribute
    {
        public string[] Orders { get; private set; }

        public SortOrderAttribute(params string[] orders)
        {
            Orders = orders;
        }
    }
}
