import {useState} from "react";
import "./index.css";
import {
    Box,
    Button, Checkbox,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import Paper from '@mui/material/Paper';
import { useMutation, useQuery} from '@apollo/client';
import {GET_TASKS} from "./queries";
import {DELETE_TASK, ADD_TASK, UPDATE_TASK} from "./mutations";

const App = () => {
    const [value, setValue] = useState<string>("");
    const [error, showError] = useState<Boolean>(false);
    const { data, loading, refetch: getTasks } = useQuery(GET_TASKS);
    const [removeTask] = useMutation(DELETE_TASK);
    const [addTask] = useMutation(ADD_TASK);
    const [updateTask] = useMutation(UPDATE_TASK);
    if(loading) return `loading`;
    const handleSave =  async () => {
        try {
            if (value.trim()) {
                await addTask({
                    variables: { text: value },
                });
                getTasks();
                setValue("");
            }
            console.log(`the value should be not empty`)
        } catch (error){
            console.log(error);
        }
    }

    const handleRemove = async (id) => {
        try {
            await removeTask({
                variables: { id },
            });
            getTasks();
        }catch (error){
            console.log(error);
        }
    }

    const handleComplete = async (id, completed) => {
        try {
            await updateTask({
                variables: { id, completed },
            });
        }catch (error){
            console.log(error);
        }
    }

    return (
    <div className={`container`}>
        <h2 className={`title`}>Todo List</h2>
        <Box
            display="flex"
            width={500} height={80}
            alignItems="center"
            justifyContent="center"
        >
            <TextField
                placeholder="Enter your todo task..."
                value={value}
                onChange={e => {
                    setValue(e.target.value);
                    showError(false);
                }}
            />
            <Button onClick={handleSave}>
                add task
            </Button>
        </Box>
        {error && (
            <Text className={`error`}>Error: Input field is empty...</Text>
        )}

    <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell>Id</TableCell>
                    <TableCell align="center">Text</TableCell>
                    <TableCell align="center">Completed</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {data.tasks.map((row) => (
                    <TableRow
                        key={row.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row">
                            {row.id}
                        </TableCell>
                        <TableCell align="center">{row.text}</TableCell>
                        <TableCell align="center">
                            <Checkbox
                                onChange={() => handleComplete(row.id, row.completed)}
                                inputProps={{ 'aria-label': 'controlled' }}
                            />
                        </TableCell>
                        <TableCell align="center">
                            <Button onClick={() => handleRemove(row.id)}>
                                Delete
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </TableContainer>
    </div>
    )
};
export default App;
