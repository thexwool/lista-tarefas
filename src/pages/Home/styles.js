import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100%;

    padding: 20px;
    gap: 20px;

    justify-content: center;
    align-items: center;
    text-align: center;
`;

export const TitleBox = styled.div``;

export const StyledMessage = styled.p`
  font-size: 1.5rem;
  font-weight: 500;
  color: #333;
  padding: 20px;
  border-radius: 10px;
  background-color: #f8f9fa;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin: 20px 0;
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`;

export const GreetingText = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #FFFFFF;
  text-shadow: 1px 1px 2px #000;
  margin-bottom: 20px;
`;

export const ListBox = styled.div`
    width: 100%;
    //background-color: aqua;
`;
