import React from 'react';
import styled from 'styled-components';

const CategoryBtn = ({ onClick, label = "Add Category" }) => {
  return (
    <StyledWrapper>
      <button className="button" onClick={onClick}>
       
        {label}
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .button {
    width: fit-content;
    display: flex;
    align-items: center;
    padding: 1.2em 1rem;
    cursor: pointer;
    gap: 0.4rem;
    font-weight: bold;
    border-radius: 30px;
    background: linear-gradient(15deg, #000000, #222222, #444444, #666666, #ffffff, #666666, #444444, #222222, #000000) no-repeat;
    background-size: 300%;
    color: #fff;
    border: none;
    background-position: left center;
    box-shadow: 0 30px 10px -20px rgba(0,0,0,.2);
    transition: background .3s ease;
  }

  .button:hover {
    background-size: 320%;
    background-position: right center;
  }

  .button:hover svg {
    fill: #fff;
  }

  .button svg {
    width: 23px;
    fill: #ffffff;
    transition: .3s ease;
  }
`;

export default CategoryBtn;
