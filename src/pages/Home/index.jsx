import ItemList from "../../components/ItemList";
import { Container, ListBox, TitleBox, GreetingText, StyledMessage } from "./styles";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { AnimatePresence, motion } from 'framer-motion';

import useApi from '../../helpers/Api';
import { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import Box from '@mui/material/Box';

const Home = () => {
    const api = useApi();

    const [nameTaskInsert, setNameTaskInsert] = useState("");
    const [costTaskInsert, setCostTaskInsert] = useState("");
    const [dateLimitTaskInsert, setDateLimitTaskInsert] = useState("");
    const [openModalInsert, setOpenModalInsert] = useState(false);
    const [formTouched, setFormTouched] = useState(false);

    const handleOpenModalInsert = () => setOpenModalInsert(true);
    const handleCloseModalInsert = () => {
        setNameTaskInsert("");
        setCostTaskInsert("");
        setDateLimitTaskInsert("");
        setOpenModalInsert(false);
        setFormTouched(false);
    };

    const [loading, setLoading] = useState(true);
    const [loadingInsert, setLoadingInsert] = useState(false);
    const [listTask, setListTask] = useState([]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) {
            return "Bom dia!";
        } else if (hour < 18) {
            return "Boa tarde!";
        } else {
            return "Boa noite!";
        }
    };

    const handleInsertTask = async (e) => {
        e.preventDefault();
        setFormTouched(true);

        if (!nameTaskInsert || !costTaskInsert || !dateLimitTaskInsert) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        if (costTaskInsert <= 0) {
            alert("O custo deve ser um valor positivo.");
            return;
        }

        const taskExists = listTask.some(task => task.nome.toLowerCase() === nameTaskInsert.toLowerCase());
        if (taskExists) {
            alert("Já existe uma tarefa com este nome.");
            return;
        }

        try {
            setLoadingInsert(true);
            const responseCreateTask = await api.createItem(nameTaskInsert, costTaskInsert, dateLimitTaskInsert);
            console.log("responseCreateTask: ", responseCreateTask);
            setListTask(await api.readAll());
            handleCloseModalInsert();
        } catch (error) {
            console.log("ERRO: ", error);
        } finally {
            setLoadingInsert(false);
            setFormTouched(false);
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            await api.deleteItem(id);
            setListTask((prevTasks) => prevTasks.filter((task) => task.id !== id));
        } catch (error) {
            console.error("Erro ao deletar tarefa: ", error);
        }
    };

    const handleEditTask = async (id, name, cost, dateLimit) => {
        const taskExists = listTask.some(task => task.nome.toLowerCase() === name.toLowerCase() && task.id !== id);
        if (taskExists) {
            alert("Já existe outra tarefa com este nome.");
            return;
        }

        try {
            await api.editItem(id, name, cost, dateLimit);
            setListTask((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === id ? { ...task, nome: name, custo: cost, data_limite: dateLimit } : task
                )
            );
        } catch (error) {
            console.error("Erro ao editar tarefa: ", error);
        }
    };

    const handleMoveUp = async (id) => {
        const index = listTask.findIndex(task => task.id === id);
        if (index > 0) {
            const updatedTasks = [...listTask];
            [updatedTasks[index - 1], updatedTasks[index]] = [updatedTasks[index], updatedTasks[index - 1]];
            setListTask(updatedTasks);
            try {
                await updateTaskOrders(updatedTasks);
            } catch (error) {
                console.error('Erro ao mover tarefa para cima: ', error);
            }
        }
    };

    const handleMoveDown = async (id) => {
        const index = listTask.findIndex(task => task.id === id);
        if (index < listTask.length - 1) {
            const updatedTasks = [...listTask];
            [updatedTasks[index], updatedTasks[index + 1]] = [updatedTasks[index + 1], updatedTasks[index]];
            setListTask(updatedTasks);
            try {
                await updateTaskOrders(updatedTasks);
            } catch (error) {
                console.error('Erro ao mover tarefa para baixo: ', error);
            }
        }
    };

    const updateTaskOrders = async (tasks) => {
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            if (task.ordem_apresentacao !== i + 1) {
                await api.updateOrder(task.id, i + 1);
                task.ordem_apresentacao = i + 1;
            }
        }
    };

    const style = {
        display: "flex",
        flexDirection: "column",
        gap: 2,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        bgcolor: 'background.paper',
        border: '0px',
        boxShadow: "rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, " +
                   "rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, " +
                   "rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset",
        p: 5,
        borderRadius: "15px"
    };

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true);
                const tasks = await api.readAll();
                setListTask(tasks);
            } catch (error) {
                console.error("Erro ao buscar tarefas: ", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, [api]);

    return (
        <Container>
            <TitleBox>
                <GreetingText>{getGreeting()} Todo list of the ALLAN</GreetingText>
            </TitleBox>
            <ListBox>
                {loading ? (
                    <CircularProgress style={{ margin: 10 }} />
                ) : listTask.length === 0 ? (
                    <StyledMessage onClick={handleOpenModalInsert}>Estamos sem tarefas, vamos registrar uma?</StyledMessage>
                ) : (
                    <AnimatePresence>
                        {listTask.map((task, index) => (
                            <motion.div
                                key={task.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ItemList
                                    id={task.id}
                                    name={task.nome}
                                    cost={task.custo}
                                    dateLimit={task.data_limite}
                                    onDelete={handleDeleteTask}
                                    onEdit={handleEditTask}
                                    canMoveUp={index !== 0}
                                    canMoveDown={index !== listTask.length - 1}
                                    onMoveUp={handleMoveUp}
                                    onMoveDown={handleMoveDown}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
                <Button variant="contained" fullWidth style={{ padding: "15px" }} onClick={handleOpenModalInsert}>ADICIONAR</Button>
            </ListBox>

            <Modal
                open={openModalInsert}
                onClose={handleCloseModalInsert}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box component="form" sx={style}>
                    <h1>Adicionar tarefa</h1>
                    <TextField
                        required
                        id="nameTaskInsert"
                        label="Nome"
                        variant="outlined"
                        value={nameTaskInsert}
                        onChange={e => setNameTaskInsert(e.target.value)}
                        error={formTouched && !nameTaskInsert}
                        helperText={formTouched && !nameTaskInsert ? 'Este campo é obrigatório' : ''}
                    />
                    <TextField
                        required
                        id="costTaskInsert"
                        label="Custo"
                        variant="outlined"
                        value={costTaskInsert}
                        onChange={e => setCostTaskInsert(e.target.value)}
                        type="number"
                        error={formTouched && (!costTaskInsert || costTaskInsert <= 0)}
                        helperText={
                            formTouched && (!costTaskInsert ? 'Este campo é obrigatório' :
                            costTaskInsert <= 0 ? 'O custo deve ser positivo' : '')
                        }
                    />
                    <TextField
                        required
                        id="dateLimitTaskInsert"
                        label="Data Limite"
                        variant="outlined"
                        value={dateLimitTaskInsert}
                        onChange={e => setDateLimitTaskInsert(e.target.value)}
                        type="date"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        error={formTouched && !dateLimitTaskInsert}
                        helperText={formTouched && !dateLimitTaskInsert ? 'Este campo é obrigatório' : ''}
                    />

                    <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        style={{ padding: "15px" }}
                        onClick={handleInsertTask}
                        disabled={!nameTaskInsert || !costTaskInsert || !dateLimitTaskInsert || costTaskInsert <= 0}
                    >
                        {loadingInsert ? <CircularProgress size={24} /> : 'ADICIONAR'}
                    </Button>
                    <Button variant="outlined" fullWidth style={{ padding: "15px" }} onClick={handleCloseModalInsert}>CANCELAR</Button>
                </Box>
            </Modal>
        </Container>
    );
};

export default Home;
