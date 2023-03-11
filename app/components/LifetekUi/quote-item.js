// @flow
import React from 'react';
import styled from 'styled-components';

const grid = 8;
const borderRadius = 2;
const getBackgroundColor = (isDragging, isGroupedOver, color) => {
  if (isDragging) {
    return 'black';
  }

  if (isGroupedOver) {
    return color;
  }

  return 'white';
};

const getBorderColor = (isDragging, color) => (isDragging ? color : 'transparent');

const Container = styled.a`
  border-radius: ${borderRadius}px;
  border: 2px solid transparent;
  border-color: ${props => getBorderColor(props.isDragging, props.colors)};
  background-color: ${props => getBackgroundColor(props.isDragging, props.isGroupedOver, props.colors)};
  box-shadow: ${({ isDragging }) => (isDragging ? `2px 2px 1px black` : 'blue')};
  padding: ${grid}px;
  min-height: 40px;
  margin-bottom: ${grid}px;
  user-select: none;

  /* anchor overrides */
  color: 'gray';

  &:hover,
  &:active {
    color: blue;
    text-decoration: none;
  }

  &:focus {
    outline: none;
    border-color: ${props => props.colors};
    box-shadow: none;
  }

  /* flexbox */
  display: flex;
`;

// const Avatar = styled.img`
//   width: 40px;
//   height: 40px;
//   border-radius: 50%;
//   margin-right: ${grid}px;
//   flex-shrink: 0;
//   flex-grow: 0;
// `;

const Content = styled.div`
  /* flex child */
  flex-grow: 1;
  /*
    Needed to wrap text in ie11
    https://stackoverflow.com/questions/35111090/why-ie11-doesnt-wrap-the-text-in-flexbox
  */
  flex-basis: 100%;
  /* flex parent */
  display: flex;
  flex-direction: column;
`;

const BlockQuote = styled.div`
  &::before {
    content: open-quote;
  }
  &::after {
    content: close-quote;
  }
`;

const Footer = styled.div`
  display: flex;
  margin-top: ${grid}px;
  align-items: center;
`;

const Title = styled.p`
  margin: 0;
  border-radius: ${borderRadius}px;
  font-weight: bold;
  padding: ${grid / 2}px;
`;

const QuoteId = styled.small`
  flex-grow: 1;
  flex-shrink: 1;
  margin: 0;
  font-weight: normal;
  text-overflow: ellipsis;
  text-align: right;
`;

// Previously this extended React.Component
// That was a good thing, because using React.PureComponent can hide
// issues with the selectors. However, moving it over does can considerable
// performance improvements when reordering big lists (400ms => 200ms)
// Need to be super sure we are not relying on PureComponent here for
// things we should be doing in the selector as we do not know if consumers
// will be using PureComponent
function QuoteItem(props) {
  const { quote, isDragging, isGroupedOver, provided } = props;

  return (
    <Container
      isDragging={isDragging}
      isGroupedOver={isGroupedOver}
      colors={quote.colors}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <Content>
        <Title>{quote.name}</Title>
        <BlockQuote>{quote.name}</BlockQuote>
        <Footer>
          {/* <Author colors={quote.author.colors}>{quote.author.name}</Author> */}
          <QuoteId>
            id:
            {quote._id}
          </QuoteId>
        </Footer>
      </Content>
    </Container>
  );
}

export default React.memo(QuoteItem);
