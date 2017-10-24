import React from 'react';
import { Redirect } from 'react-router-dom';

const Index = () => (
    <Redirect to="/users"/>
);

export { Index as default }
