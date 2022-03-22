import React, {FC} from 'react';
import NumberFormat from "react-number-format"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCheckCircle, faCheckSquare, faSquare } from '@fortawesome/fontawesome-free-solid';
import { IconProp } from '@fortawesome/fontawesome-svg-core';



interface Props {
    value?: number
}


interface CostsFormatProps {
    value?: number
    showPrefix?: boolean,
    showSuffix?: boolean,
}


interface EffortFormatProps {
    value?: number
    showPrefix?: boolean,
    showSuffix?: boolean,
}


export const CostsFormat = ({ value, showPrefix, showSuffix }: CostsFormatProps) => {
    
    if (typeof (value) === 'undefined' || value == null) {
        return (<></>);
    }

    return (
        <NumberFormat
            value={value}
            thousandSeparator={','}
            prefix={showPrefix ? '€ ':''}
            suffix={showSuffix ? ' €' : ''}
            displayType={'text'}
            decimalScale={2}
            fixedDecimalScale={true}
        />
    )
}
CostsFormat.defaultProps = {
    showPrefix: false,
    showSuffix: true,
    value: 0
};




export const EffortFormat = ({ value, showPrefix, showSuffix }: EffortFormatProps) => {
    
    if (typeof (value) === 'undefined' || value == null) { 
        return (<></>);
    }
    
    return (
        <NumberFormat
            value={value}
            thousandSeparator={','}
            prefix = { showPrefix? 'PY ': '' }
            suffix = { showSuffix? ' PY': '' }
            displayType={'text'}
            decimalScale={2}
            fixedDecimalScale={true}
        />
    )
}
EffortFormat.defaultProps = {
    showPrefix: false,
    showSuffix: true,
    value: 0
};

export function __delay__(timer: number | undefined) {
    return new Promise<void>(resolve => {
        timer = timer || 2000;
        setTimeout(function () {
            resolve();
        }, timer);
    });
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
const faCheckCricleIcon = faCheckCircle as IconProp;
const faSquareIcon = faSquare as IconProp;


export const BooleanIconFormat = ({ value, type, showFalse }: BooleanIconProps) => {
    let trueValue;
    let falseValue;

    switch (type) {
        case 'text':
            trueValue = value.toString();
            falseValue = showFalse ? value.toString() : '';
            break;
        case 'circle':
            trueValue = <FontAwesomeIcon icon={faCheckCricleIcon} className="check-true" />;
            falseValue = showFalse ? <FontAwesomeIcon icon={faCheckCricleIcon} className="check-false" /> : '';
            break;
        case 'square':
            trueValue = <FontAwesomeIcon icon={faCheckSquareIcon} className="check-true" />;
            falseValue = showFalse ? <FontAwesomeIcon icon={faSquareIcon} className="check-false" /> : '';
            break;
        case 'check':
            trueValue = <FontAwesomeIcon icon={faCheckIcon} className="check-true" />;
            falseValue = showFalse ? <FontAwesomeIcon icon={faCheckIcon} className="check-false" /> : '';
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