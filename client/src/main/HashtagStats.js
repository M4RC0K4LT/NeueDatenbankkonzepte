import React, { Component } from "react";
import { Typography, TableContainer, Table, TableBody, TableRow, TableCell } from '@material-ui/core';
import { SocketContext } from "../components/exports";
import { Link } from "react-router-dom";

class HashtagStats extends Component {
    constructor() {
        super();
        this.state = {
          response: [],
        };
        this.socket = SocketContext;
    }

    componentDidMount(){
        this.socket.emit("get hashtagstats");

        this.socket.on('hashtagstats', (rawPost => {
            let newlist = rawPost.reduce(function(result, value, index, array) {
                if (index % 2 === 0)
                  result.push(array.slice(index, index + 2));
                return result;
            }, []);
            this.setState({ response: newlist.reverse() });
        }));
    }

    render() {
        return (
            <div>
                <Typography variant="h3" align="center">#Hashtags</Typography>
                <br></br>
                <Typography variant="h4" align="center"></Typography>
                <br></br><br></br><hr></hr><br></br><br></br>
                    <TableContainer>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Position</TableCell>
                                    <TableCell>Hashtag</TableCell>
                                    <TableCell>Counter</TableCell>
                                </TableRow>
                                {this.state.response.map((data, value) => {
                                    return (
                                        <TableRow>
                                            <TableCell>{value+1}</TableCell>
                                            <TableCell><Link className="linkified" to={"/hashtags/" + data[0]}>#{data[0].toString()}</Link></TableCell>
                                            <TableCell>{data[1]}</TableCell>
                                        </TableRow>
                                    )
                                })}
                                
                            </TableBody>
                        </Table>    
                    </TableContainer>
            </div>
        );
    }
}

export default HashtagStats;