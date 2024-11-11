import { useState } from "react";
import { TaskItem, TaskName, TaskActions, TaskCost, TaskDate } from "./styles";
import IconButton from '@mui/material/IconButton';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { Modal, Box, TextField, Button, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

// eslint-disable-next-line react/prop-types
const ItemList = ({ name, id, cost, dateLimit, onDelete, onEdit, canMoveUp, canMoveDown, onMoveUp, onMoveDown }) => {
    const [openEditModal, setOpenEditModal] = useState(false);
    const [nameTaskEdit, setNameTaskEdit] = useState(name);
    const [costTaskEdit, setCostTaskEdit] = useState(cost);
    const [dateLimitTaskEdit, setDateLimitTaskEdit] = useState(dateLimit);
    const [loadingEdit, setLoadingEdit] = useState(false);

    const [nameTouched, setNameTouched] = useState(false);
    const [costTouched, setCostTouched] = useState(false);
    const [dateLimitTouched, setDateLimitTouched] = useState(false);

    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

    const handleOpenEditModal = () => setOpenEditModal(true);

    const handleCloseEditModal = () => {
        setNameTaskEdit(name);
        setCostTaskEdit(cost);
        setDateLimitTaskEdit(dateLimit);
        setOpenEditModal(false);
        setNameTouched(false);
        setCostTouched(false);
        setDateLimitTouched(false);
    };

    const handleDelete = () => {
        setOpenConfirmDialog(true);
    };

    const handleConfirmDelete = async () => {
        setOpenConfirmDialog(false);
        await onDelete(id);
    };

    const handleCancelDelete = () => {
        setOpenConfirmDialog(false);
    };

    const handleEdit = async (e) => {
        e.preventDefault();

        if (!nameTaskEdit || !costTaskEdit || !dateLimitTaskEdit) {
            alert("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        if (costTaskEdit <= 0) {
            alert("O custo deve ser um valor positivo.");
            return;
        }

        setLoadingEdit(true);
        await onEdit(id, nameTaskEdit, costTaskEdit, dateLimitTaskEdit);
        setLoadingEdit(false);
        handleCloseEditModal();
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
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        p: 5,
        borderRadius: "15px"
    };

    const isHighCost = parseFloat(cost) >= 1000;

    return (
        <>
            <TaskItem isHighCost={isHighCost}>
                <div>
                    <TaskName>{name}</TaskName>
                    <TaskDate>{"\t|\t"}</TaskDate>
                    <TaskCost>R$ {parseFloat(cost).toFixed(2)}</TaskCost>
                    <TaskDate>{"\t|\t"}</TaskDate>
                    <TaskDate>Data Limite: {dateLimit}</TaskDate>
                </div>
                <TaskActions>
                    <IconButton
                        color="primary"
                        aria-label="subir"
                        onClick={() => onMoveUp(id)}
                        disabled={!canMoveUp}
                    >
                        <ArrowUpwardIcon />
                    </IconButton>
                    <IconButton
                        color="primary"
                        aria-label="descer"
                        onClick={() => onMoveDown(id)}
                        disabled={!canMoveDown}
                    >
                        <ArrowDownwardIcon />
                    </IconButton>
                    <IconButton color="info" aria-label="editar" onClick={handleOpenEditModal}>
                        <EditIcon />
                    </IconButton>
                    <IconButton aria-label="delete" color="error" onClick={handleDelete}>
                        <DeleteIcon />
                    </IconButton>
                </TaskActions>
            </TaskItem>

            {/* Diálogo de confirmação de exclusão */}
            <Dialog
                open={openConfirmDialog}
                onClose={handleCancelDelete}
            >
                <DialogTitle>Confirmar Exclusão</DialogTitle>
                <DialogContent>
                    Tem certeza que deseja excluir a tarefa &quot;{name}&quot;?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} color="primary">
                        Não
                    </Button>
                    <Button onClick={handleConfirmDelete} color="primary">
                        Sim
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal de edição */}
            <Modal
                open={openEditModal}
                onClose={handleCloseEditModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box component="form" sx={style}>
                    <h1>Editar tarefa</h1>
                    <TextField
                        required
                        label="Nome"
                        variant="outlined"
                        value={nameTaskEdit}
                        onChange={(e) => {
                            setNameTaskEdit(e.target.value);
                            setNameTouched(true);
                        }}
                        error={nameTouched && !nameTaskEdit}
                        helperText={nameTouched && !nameTaskEdit ? 'Este campo é obrigatório' : ''}
                    />
                    <TextField
                        required
                        label="Custo"
                        variant="outlined"
                        value={costTaskEdit}
                        onChange={(e) => {
                            setCostTaskEdit(e.target.value);
                            setCostTouched(true);
                        }}
                        type="number"
                        error={costTouched && (!costTaskEdit || costTaskEdit <= 0)}
                        helperText={
                            costTouched && (!costTaskEdit ? 'Este campo é obrigatório' :
                            costTaskEdit <= 0 ? 'O custo deve ser positivo' : '')
                        }
                    />
                    <TextField
                        required
                        label="Data Limite"
                        variant="outlined"
                        value={dateLimitTaskEdit}
                        onChange={(e) => {
                            setDateLimitTaskEdit(e.target.value);
                            setDateLimitTouched(true);
                        }}
                        type="date"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        error={dateLimitTouched && !dateLimitTaskEdit}
                        helperText={dateLimitTouched && !dateLimitTaskEdit ? 'Este campo é obrigatório' : ''}
                    />

                    <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        style={{ padding: "15px" }}
                        onClick={handleEdit}
                        disabled={!nameTaskEdit || !costTaskEdit || !dateLimitTaskEdit || costTaskEdit <= 0}
                    >
                        {loadingEdit ? <CircularProgress size={24} /> : 'SALVAR'}
                    </Button>
                    <Button variant="outlined" fullWidth style={{ padding: "15px" }} onClick={handleCloseEditModal}>CANCELAR</Button>
                </Box>
            </Modal>
        </>
    );
};

export default ItemList;
