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

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
const Home = () => {
  const location = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [records, setRecords] = useState([]);
  const [taskId, setTaskId] = useState('');
  const [edit, setEdit] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [remarks, setRemarks] = React.useState('');
  const [remarksOpen, setRemarksOpen] = React.useState(false);
  const [date, setDate] = React.useState('');
  const [duration, setDuration] = React.useState('');
  const [comment, setComment] = React.useState('');
  const [value, setValue] = React.useState(0);
  const [redirectTo, setRedirectTo] = useState(false);
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
    getRecords()
  };
  const handleOpen = (taskId) => {
    setOpen(true);
    setTaskId(taskId);
  }
  const handleClose = () => {
    setOpen(false);
    setTaskId('');
  }
  
  const handleEditOpen = (taskId) => {
    setEdit(true);
    setTaskId(taskId)
  }
  const handleEditClose = () => {
    setEdit(false);
    setTaskId('')
  }
  
  const handleRemarksOpen = (remarks) => {
    setRemarksOpen(true);
    setRemarks(remarks)
  }
  const handleRemarksClose = () => {
    setRemarksOpen(false);
    setRemarks('')
  }
  
  useEffect (()=>{
    if(!localStorage.getItem('user_id')) {
      setRedirectTo(true)
      return
    }
    getTasks();
    getRecords();
  },[]);
  
  const getTasks = async () => {
    const response = await Api("get", `task/tasks`);
    if (response.status === 200)
      setTasks(response.data.data);
    else
      alert(response.data.msg);
  }
  
  const getRecords = async () => {
    const response = await Api("get", `task/records?type=${value? 'monthly':'weekly'}&userId=${localStorage.getItem("user_id")}`);
    if (response.status === 200)
      setRecords(response.data.data);
    else
      alert(response.data.msg);
  }
  
  const editEntry = async (taskId) => {
    const response = await Api("get", `task/get-single-entry/${taskId}`);
    if (response.status === 200) {
      setDate(response.data.data.date);
      setDuration(response.data.data.duration);
      setComment(response.data.data.comment);
      handleEditOpen(taskId)
    } else
      alert(response.data.msg);
  }
  
  const sendRequest = async (taskId) => {
    const response = await Api("get", `task/send-request/${taskId}`);
    if (response.status === 200) {
      alert(response.data.msg);
      getRecords()
    } else
      alert(response.data.msg);
  }
  
  const submit = async () => {
    if (date.length === 0 || duration.length === 0 || comment.length === 0)
      alert("date, duration & comment is required");
    else {
      const formData = new FormData();
      formData.append("taskId", taskId);
      formData.append("userId", localStorage.getItem("user_id"));
      formData.append("date", date);
      formData.append("duration", duration);
      formData.append("comment", comment);
      const response = await Api("post", `task/add-entry`, formData);
      if (response.status === 201) {
        handleClose()
        setTaskId('');
        setDate('');
        setDuration('');
        setComment('');
        getRecords()
        alert(response.data.msg)
      } else
        alert(response.data.msg);
    }
  };
  
  const update = async () => {
    if (date.length === 0 || duration.length === 0 || comment.length === 0)
      alert("date, duration & comment is required");
    else {
      const formData = new FormData();
      formData.append("date", date);
      formData.append("duration", duration);
      formData.append("comment", comment);
      const response = await Api("put", `task/${taskId}`, formData);
      if (response.status === 200) {
        handleEditClose()
        setTaskId('');
        setDate('');
        setDuration('');
        setComment('');
        getRecords()
        alert(response.data.msg)
      } else
        alert(response.data.msg);
    }
  };
  
  const logout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("name");
    localStorage.removeItem("admin");
    setRedirectTo(true)
  }
  
  const btnstyle={margin:'8px 0'}
  
  return(
    (redirectTo && location('/')),
    <>
      <div style={{textAlign: 'left', paddingLeft: 30, width: '50%', display: 'inline-block'}}>
        <Button type='submit' color='primary' variant="contained" style={btnstyle} onClick={() => location('/view-requests')}>View Requests</Button>
      </div>
      <div style={{textAlign: 'right', paddingRight: 30, width: '45%', display: 'inline-block'}}>
        <Button type='submit' color='primary' variant="contained" style={btnstyle} onClick={() => logout()}>Logout</Button>
      </div>
      <h4 style={{padding: '10px 0', textAlign: 'center'}}><span style={{textTransform: 'capitalize'}}>{localStorage.getItem('name')}</span>'s Dashboard</h4>
      <Grid container spacing={1} style={{padding: '0 30px'}}>
        {tasks.map(task=> (
          <Grid item xl={2} lg={3} md={3} sm={4} xs={6} key={task._id}>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Typography sx={{ fontSize: 14 }} style={{textTransform: 'capitalize'}} color="initial" gutterBottom>
                  {task.title}
                </Typography>
                <Typography sx={{ fontSize: 12 }} style={{textTransform: 'capitalize'}} color="initial" gutterBottom>
                  Project: {task.project_id.title}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={()=>handleOpen(task._id)}>Add Entry</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
  
        <Box sx={{ width: '100%', marginTop: 10 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="Weekly" {...a11yProps(0)} />
              <Tab label="Monthly" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Sr #</TableCell>
                    <TableCell align="center">Project</TableCell>
                    <TableCell align="center">Task</TableCell>
                    <TableCell align="center">Date</TableCell>
                    <TableCell align="center">Duration</TableCell>
                    <TableCell align="center">Comment</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records.map((record, index) => (
                    <TableRow
                      key={index}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">{++index}</TableCell>
                      <TableCell align="center" style={{textTransform: 'capitalize'}}>{record.task_id.project_id.title}</TableCell>
                      <TableCell align="center" style={{textTransform: 'capitalize'}}>{record.task_id.title}</TableCell>
                      <TableCell align="center">{record.date}</TableCell>
                      <TableCell align="center">{record.duration}</TableCell>
                      <TableCell align="center">{record.comment}</TableCell>
                      <TableCell align="center" style={{textTransform: 'capitalize'}}>{record.requested? record.status:'-----'}</TableCell>
                      <TableCell align="center">
                        {record.status !== 'approved'? (
                          <>
                          <Button color='inherit' variant="contained" style={btnstyle} onClick={() => editEntry(record._id)}>Edit</Button>
                          {record.status !== 'pending'? (
                            <Button color='secondary' variant="contained" style={{...btnstyle, marginLeft: 10}} onClick={() => sendRequest(record._id)}>Send Request</Button>
                          ):null}
                            {record.remarks? (
                              <Button color='inherit' variant="contained" style={{...btnstyle, marginLeft: 10}} onClick={() => handleRemarksOpen(record.remarks)}>Remarks</Button>
                            ):null}
                          </>
                        ):null}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Sr #</TableCell>
                    <TableCell align="center">Project</TableCell>
                    <TableCell align="center">Task</TableCell>
                    <TableCell align="center">Date</TableCell>
                    <TableCell align="center">Duration</TableCell>
                    <TableCell align="center">Comment</TableCell>
                    <TableCell align="center">Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records.map((record, index) => (
                    <TableRow
                      key={index}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">{++index}</TableCell>
                      <TableCell align="center" style={{textTransform: 'capitalize'}}>{record.task_id.project_id.title}</TableCell>
                      <TableCell align="center" style={{textTransform: 'capitalize'}}>{record.task_id.title}</TableCell>
                      <TableCell align="center">{record.date}</TableCell>
                      <TableCell align="center">{record.duration}</TableCell>
                      <TableCell align="center">{record.comment}</TableCell>
                      <TableCell align="center" style={{textTransform: 'capitalize'}}>{record.requested? record.status:'-----'}</TableCell>
                      <TableCell align="center">
                        {record.status !== 'approved'? (
                          <>
                            <Button color='inherit' variant="contained" style={btnstyle} onClick={() => editEntry(record._id)}>Edit</Button>
                            {record.status !== 'pending'? (
                              <Button color='secondary' variant="contained" style={{...btnstyle, marginLeft: 10}} onClick={() => sendRequest(record._id)}>Send Request</Button>
                            ):null}
                            {record.remarks? (
                              <Button color='inherit' variant="contained" style={{...btnstyle, marginLeft: 10}} onClick={() => handleRemarksOpen(record.remarks)}>Remarks</Button>
                            ):null}
                          </>
                        ):null}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </Box>
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
            Add Entry
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField label='Date' placeholder='Enter Date' variant="outlined" type={"date"} onChange={(e)=>setDate(e.target.value)} margin={"normal"} fullWidth required />
            <TextField label='Duration' placeholder='Enter duration' type='text' variant="outlined" onChange={(e)=>setDuration(e.target.value)} margin={"normal"} fullWidth required />
            <TextField label='Comment' placeholder='Add Comment' type='text' variant="outlined" onChange={(e)=>setComment(e.target.value)} margin={"normal"} fullWidth required multiline={true} />
            <Button type='submit' color='primary' variant="contained" style={btnstyle} fullWidth onClick={() => submit()}>Submit</Button>
          </Typography>
        </Box>
      </Modal>
  
      <Modal
        open={edit}
        onClose={handleEditClose}
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
            Update Entry
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField label='Date' placeholder='Enter Date' variant="outlined" type={"date"} value={date} onChange={(e)=>setDate(e.target.value)} margin={"normal"} fullWidth required />
            <TextField label='Duration' placeholder='Enter duration' type='text' variant="outlined" value={duration} onChange={(e)=>setDuration(e.target.value)} margin={"normal"} fullWidth required />
            <TextField label='Comment' placeholder='Add Comment' type='text' variant="outlined" value={comment}  onChange={(e)=>setComment(e.target.value)} margin={"normal"} fullWidth required multiline={true} />
            <Button type='submit' color='primary' variant="contained" style={btnstyle} fullWidth onClick={() => update()}>Update</Button>
          </Typography>
        </Box>
      </Modal>
  
      <Modal
        open={remarksOpen}
        onClose={handleRemarksClose}
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
            View Remarks
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <p>{remarks}</p>
            <Button type='submit' color='primary' variant="contained" style={btnstyle} fullWidth onClick={handleRemarksClose}>Close</Button>
          </Typography>
        </Box>
      </Modal>
    </>
  )
}

export default Home