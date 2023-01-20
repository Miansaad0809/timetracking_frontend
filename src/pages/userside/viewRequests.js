import React, {useState, useEffect} from 'react';
import {Grid, Button, Typography, TextField} from '@material-ui/core';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Modal from '@mui/material/Modal';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {Api} from "../../utils/Api";
import {useNavigate} from "react-router-dom";

const ViewRequest = () => {
  const location = useNavigate();
  const [requests, setRequests] = useState([]);
  const [remarks, setRemarks] = React.useState('');
  const [redirectTo, setRedirectTo] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [taskId, setTaskId] = useState('');
  
  const handleOpen = (taskId) => {
    setOpen(true);
    setTaskId(taskId);
  }
  const handleClose = () => {
    setOpen(false);
    setTaskId('');
  }
  
  useEffect (()=>{
    if(!localStorage.getItem('user_id')) {
      setRedirectTo(true)
      return
    }
    getRequests();
  }, []);
  
  const getRequests = async () => {
    const response = await Api("get", `task/view-all-requests`);
    if (response.status === 200)
      setRequests(response.data.data);
    else
      alert(response.data.msg);
  }
  
  const changeRequestStatus = async (taskId, status) => {
    const formData = new FormData();
    formData.append("status", status);
    formData.append("remarks", remarks);
    const response = await Api("post", `task/change-request-status/${taskId}`, formData);
    if (response.status === 200) {
      handleClose()
      setTaskId('');
      setRemarks('');
      alert(response.data.msg)
      getRequests()
    } else
      alert(response.data.msg);
  };
  
  const btnstyle={margin:'8px 0'}
  
  return(
      (redirectTo && location('/')),
      <>
        <h4 style={{padding: '10px 0', textAlign: 'center'}}>View Requests</h4>
        <Grid container spacing={1} style={{padding: '0 30px'}}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Sr #</TableCell>
                  <TableCell align="center">User</TableCell>
                  <TableCell align="center">Project</TableCell>
                  <TableCell align="center">Task</TableCell>
                  <TableCell align="center">Date</TableCell>
                  <TableCell align="center">Duration</TableCell>
                  <TableCell align="center">Comment</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.map((record, index) => (
                  <TableRow
                    key={index}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">{++index}</TableCell>
                    <TableCell align="center" style={{textTransform: 'capitalize'}}>{record.user_id.name}</TableCell>
                    <TableCell align="center" style={{textTransform: 'capitalize'}}>{record.task_id.project_id.title}</TableCell>
                    <TableCell align="center" style={{textTransform: 'capitalize'}}>{record.task_id.title}</TableCell>
                    <TableCell align="center">{record.date}</TableCell>
                    <TableCell align="center">{record.duration}</TableCell>
                    <TableCell align="center">{record.comment}</TableCell>
                    <TableCell align="center">
                      {record.status !== 'approved'? (
                        <>
                          <Button color='inherit' variant="contained" style={{...btnstyle, background: 'green', color: 'white'}} onClick={() => changeRequestStatus(record._id, 'approved')}>Approve</Button>
                          <Button variant="contained" style={{...btnstyle, marginLeft: 10, background: 'red', color: 'white'}} onClick={() => handleOpen(record._id)}>Reject</Button>
                        </>
                      ):null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Remarks
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <TextField label='Comment' placeholder='Add Comment' type='text' variant="outlined" onChange={(e)=>setRemarks(e.target.value)} margin={"normal"} fullWidth required multiline={true} />
              <Button type='submit' color='primary' variant="contained" style={btnstyle} fullWidth onClick={() => changeRequestStatus(taskId, 'rejected')}>Reject</Button>
            </Typography>
          </Box>
        </Modal>
      </>
  )
}

export default ViewRequest