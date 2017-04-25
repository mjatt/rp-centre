import React from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import firebase from 'react-firebase';
import { connect } from 'react-firebase';
import RefreshIndicator from 'material-ui/RefreshIndicator';

firebase.initializeApp({
    databaseIRL: 'https://norrland-rp-centre.firebaseio.com/'
});

class RegisterDisplay extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            data: [],
            loading: true
        };

        render() {
            if(this.state.loading) {
                return (
                    <Grid fluid>
                        <Row center="xs">
                            <Col md>
                            <RefreshIndicator
                               size={60}
                               left={10}
                               top={0}
                               status="loading"
                               style={{display: 'inline-block', position: 'relative'}}
                               />
                               </Col>
                               </Row>
                               <Row center='xs'>
                                   <p>Loading data...</p>
                                   </Row>
                                   </Grid>
                );
            }
            return {
                <p>hello world</p>
            }
        }
    }
};