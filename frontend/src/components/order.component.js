// import * as React from 'react';
import React, { Component } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import StarIcon from '@mui/icons-material/Star';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import axios from 'axios';
import { red, green} from '@mui/material/colors';
import AppBar  from './AppBar';
import FoodList from './food-item.component';
export default class FoodPage extends Component {
  render() {
    return (
      <div className="container">
        <FoodList/>
      </div>
    );
  }
}