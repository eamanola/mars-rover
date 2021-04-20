const directions = ['N', 'E', 'S', 'W'];

const move = (position, size) => {
  let newPosition;
  let newY;
  let newX;

  switch (position.direction) {
    case 'N':
      newY = position.y < size.height ? position.y + 1 : size.height;
      newPosition = { ...position, y: newY };
      break;
    case 'E':
      newX = position.x < size.width ? position.x + 1 : size.width;
      newPosition = { ...position, x: newX };
      break;
    case 'S':
      newY = position.y > 0 ? position.y - 1 : 0;
      newPosition = { ...position, y: newY };
      break;
    case 'W':
      newX = position.x > 0 ? position.x - 1 : 0;
      newPosition = { ...position, x: newX };
      break;
    default:
      newPosition = null;
  }

  return newPosition;
};

const turnRight = (direction) => {
  const index = directions.indexOf(direction);
  const newIndex = index < directions.length - 1 ? index + 1 : 0;

  return directions[newIndex];
};

const turnLeft = (direction) => {
  const index = directions.indexOf(direction);
  const newIndex = index > 0 ? index - 1 : directions.length - 1;

  return directions[newIndex];
};

const applyInstruction = (position, instruction, plateauSize) => {
  let newPosition;

  switch (instruction) {
    case 'L':
      newPosition = { ...position, direction: turnLeft(position.direction) };
      break;
    case 'R':
      newPosition = { ...position, direction: turnRight(position.direction) };
      break;
    case 'M':
      newPosition = move(position, plateauSize);
      break;
    default:
      newPosition = null;
  }

  return newPosition;
};

const parsePlateauSize = (input) => {
  if (typeof input !== 'string') {
    return null;
  }

  if (!/^[0-9 ]+$/.test(input)) {
    return null;
  }

  const parts = input.split(' ');
  if (parts.length !== 2) {
    return null;
  }

  return { width: Number(parts[0]), height: Number(parts[1]) };
};

const parsePosition = (input) => {
  if (typeof input !== 'string') {
    return null;
  }

  if (!/^[0-9 NSWE]+$/.test(input)) {
    return null;
  }

  const parts = input.split(' ');
  if (parts.length !== 3) {
    return null;
  }

  if (
    Number.isNaN(parts[0])
    || Number.isNaN(parts[1])
    || directions.indexOf(parts[2]) === -1
  ) {
    return null;
  }

  return { x: Number(parts[0]), y: Number(parts[1]), direction: parts[2] };
};

const parseInstructions = (input) => {
  if (typeof input !== 'string') {
    return null;
  }

  if (!/^[MRL]+$/.test(input)) {
    return null;
  }

  return input;
};

const navigate = (plateauSizeInput, positionInput, instructionsInput) => {
  const plateauSize = parsePlateauSize(plateauSizeInput);
  const initialPosition = parsePosition(positionInput);
  const instructions = parseInstructions(instructionsInput);

  if (plateauSize === null
    || initialPosition === null
    || instructions === null
  ) {
    // console.log('invalid param');
    return null;
  }

  if (initialPosition.x > plateauSize.width
  || initialPosition.y > plateauSize.height) {
    // console.log('fall out of mars');
    return null;
  }

  let newPosition = initialPosition;
  for (let i = 0, il = instructions.length; i < il; i += 1) {
    newPosition = applyInstruction(newPosition, instructions[i], plateauSize);
  }

  return `${newPosition.x} ${newPosition.y} ${newPosition.direction}`;
};

// if (process.env.NODE_ENV !== 'test') {
//   console.log(navigate('5 5', '1 2 N', 'LMLMLMLMM'));
//   console.log(navigate('5 5', '3 3 E', 'MMRMMRMRRM'));
// }

module.exports = {
  navigate,
  applyInstruction,
  turnRight,
  turnLeft,
  move,
  parsePlateauSize,
  parsePosition,
  parseInstructions,
};
