import React from 'react';
import {NumericFormat} from "react-number-format"

const dateMonthFormatter = new Intl.DateTimeFormat("en-GB", {
    month: "short",
    timeZone: "UTC",
});

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
});

function formatDateValue(value: string | Date) {
    if (typeof value === "string") {
        const dateOnlyMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})/);

        if (dateOnlyMatch) {
            const [, year, month, day] = dateOnlyMatch;
            const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

            return `${day} ${dateMonthFormatter.format(date)} ${year}`;
        }
    }

    return dateFormatter.format(value instanceof Date ? value : new Date(value));
}

export const DateFormat = ({children}: { children: string | Date | null | undefined }) => {
    if (!children) {
        return null;
    }

    return <>{formatDateValue(children)}</>;
}

/******************    CostsFormat BEGIN   ******************/
interface CostsFormatProps {
    showPrefix?: boolean,
    showSuffix?: boolean,
    children: number | null,
}

export const CostsFormat = ({showPrefix, showSuffix, children}: CostsFormatProps) => {

    if (children === null || children === 0.0) {
        return null;
    }

    return (
        <NumericFormat
            className={'font-monospace'}
            value={children / 1000}
            thousandSeparator={' '}
            prefix={showPrefix ? 'k€ ' : ''}
            suffix={showSuffix ? ' k€' : ''}
            displayType={'text'}
            decimalScale={2}
            fixedDecimalScale={true}
        />
    )
}

/******************    CostsFormat END   ******************/


/******************    EffortFormat BEGIN   ******************/
interface EffortFormatProps {
    showPrefix?: boolean,
    showSuffix?: boolean,
    children: number | null
}

export const EffortFormat = ({showPrefix, showSuffix = true, children}: EffortFormatProps) => {

    if (children === null || children === 0.0) {
        return null;
    }

    return (
        <NumericFormat
            value={children}
            className={'font-monospace'}
            thousandSeparator={','}
            prefix={showPrefix ? 'PY ' : ''}
            suffix={showSuffix ? ' PY' : ''}
            displayType={'text'}
            decimalScale={2}
            fixedDecimalScale={true}
        />
    )
}
