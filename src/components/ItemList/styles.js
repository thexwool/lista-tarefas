import styled from "styled-components";

export const TaskItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid black;
  padding: 15px 30px;
  margin-bottom: 10px;
  background-color: ${({ isHighCost }) => (isHighCost ? '#FFF9C4' : '#ffff')};
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border-radius: 10px;
  
`;

export const TaskName = styled.span`
  font-size: 1.2rem;
  font-weight: bold;
`;

export const TaskCost = styled.span`
  font-size: 1rem;
  color: #555;
`;

export const TaskDate = styled.span`
  font-size: 1rem;
  color: #777;
`;

export const TaskActions = styled.div`
  display: flex;
  gap: 8px;
`;
