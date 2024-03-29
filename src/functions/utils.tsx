import React from 'react';
import {NumericFormat} from "react-number-format"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCheck, faCheckCircle, faCheckSquare, faSquare} from '@fortawesome/free-solid-svg-icons';
import {IconProp} from '@fortawesome/fontawesome-svg-core';


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
CostsFormat.defaultProps = {
    showPrefix: false,
    showSuffix: false,
};

/******************    CostsFormat END   ******************/


/******************    EffortFormat BEGIN   ******************/
interface EffortFormatProps {
    showPrefix?: boolean,
    showSuffix?: boolean,
    children: number | null
}

export const EffortFormat = ({showPrefix, showSuffix, children}: EffortFormatProps) => {

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
EffortFormat.defaultProps = {
    showPrefix: false,
    showSuffix: false,
};

/******************    BooleanIconFormat BEGIN   ******************/

/*
Usage:
<BooleanIconFormat value={partner.isCoordinator} type="circle" />
<BooleanIconFormat value={partner.isCoordinator} type="check" showFalse={true}/>

default 
    type = check 
    showFalse = false
*/
interface BooleanIconProps {
    value: boolean,
    type: "text" | "circle" | "square" | "check",
    showFalse: boolean,
}

const faCheckIcon = faCheck as IconProp;
const faCheckSquareIcon = faCheckSquare as IconProp;
const faCheckCircleIcon = faCheckCircle as IconProp;
const faSquareIcon = faSquare as IconProp;


export const BooleanIconFormat = ({value, type, showFalse}: BooleanIconProps) => {
    let trueValue;
    let falseValue;

    switch (type) {
        case 'text':
            trueValue = value.toString();
            falseValue = showFalse ? value.toString() : '';
            break;
        case 'circle':
            trueValue = <FontAwesomeIcon icon={faCheckCircleIcon} className="check-true"/>;
            falseValue = showFalse ? <FontAwesomeIcon icon={faCheckCircleIcon} className="check-false"/> : '';
            break;
        case 'square':
            trueValue = <FontAwesomeIcon icon={faCheckSquareIcon} className="check-true"/>;
            falseValue = showFalse ? <FontAwesomeIcon icon={faSquareIcon} className="check-false"/> : '';
            break;
        case 'check':
            trueValue = <FontAwesomeIcon icon={faCheckIcon} className="check-true"/>;
            falseValue = showFalse ? <FontAwesomeIcon icon={faCheckIcon} className="check-false"/> : '';
            break;
    }

    return (
        <>
            {value ? trueValue : falseValue}
        </>
    )
}

BooleanIconFormat.defaultProps = {
    type: 'check',
    showFalse: false
};

/******************    BooleanIconFormat END  ******************/