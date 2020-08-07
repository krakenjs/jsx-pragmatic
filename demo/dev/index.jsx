/* @flow */
/* @jsx regex.node */

import { regex, Regex, RegexGroup, RegexText, RegexWord } from '../../src';

const email = 'zombo.com@paypal.com';

const match = email.match(
    <Regex>
        <RegexWord />
        <RegexGroup optional>
            <RegexText>.</RegexText>
            <RegexWord />
        </RegexGroup>
        <RegexText>@</RegexText>
        <RegexGroup union name='provider'>
            <RegexText>paypal</RegexText>
            <RegexText>google</RegexText>
            <RegexText>$mail</RegexText>
        </RegexGroup>
        <RegexText>.</RegexText>
        <RegexGroup union name='tld'>
            <RegexText>com</RegexText>
            <RegexText>org</RegexText>
            <RegexText>net</RegexText>
        </RegexGroup>
    </Regex>
);

// eslint-disable-next-line no-console
console.info(email, match);
