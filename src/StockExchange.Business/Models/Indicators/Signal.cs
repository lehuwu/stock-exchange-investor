﻿using StockExchange.Business.Indicators.Common;
using System;

namespace StockExchange.Business.Models.Indicators
{
    /// <summary>
    /// Represents a signal generated by a technical indicator
    /// </summary>
    public class Signal
    {
        /// <summary>
        /// Creates a new instance of <see cref="Signal"/>
        /// </summary>
        public Signal()
        {

        }

        /// <summary>
        /// Creates a new instance of <see cref="Signal"/>
        /// </summary>
        /// <param name="action">The action to take</param>
        public Signal(SignalAction action)
        {
            Action = action;
        }

        /// <summary>
        /// The action to take
        /// </summary>
        public SignalAction Action { get; set; }

        /// <summary>
        /// Date on which to take the action
        /// </summary>
        public DateTime Date { get; set; }

        /// <summary>
        /// Type of indicator which generated the signal
        /// </summary>
        public IndicatorType IndicatorType { get; set; }

    }
}
