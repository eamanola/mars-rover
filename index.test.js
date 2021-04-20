const app = require('./index');

describe('parsePlateauSize', () => {
  test('should parse size input to a width-height number pair', () => {
    const width = 5;
    const height = 6;
    const plateauSize = app.parsePlateauSize(`${width} ${height}`);
    expect(plateauSize).toEqual({ width, height });
  });
  describe('should validate the input', () => {
    test('must be a string', () => {
      expect(app.parsePlateauSize(undefined)).toBeNull();
      expect(app.parsePlateauSize(1)).toBeNull();
      expect(app.parsePlateauSize(null)).toBeNull();
    });

    test('can contain only positive integers and spaces', () => {
      expect(app.parsePlateauSize('0 a')).toBeNull();
      expect(app.parsePlateauSize('0, 0')).toBeNull();
      expect(app.parsePlateauSize('0 -1')).toBeNull();
    });

    test('should contain 2 numbers', () => {
      expect(app.parsePlateauSize('0')).toBeNull();
      expect(app.parsePlateauSize('0 0 0')).toBeNull();
    });
  });
});

describe('parsePosition', () => {
  test('should parse x, y coordinates, and direction', () => {
    const x = 5;
    const y = 6;
    const direction = 'N';

    const position = app.parsePosition(`${x} ${y} ${direction}`);
    expect(position).toEqual({ x, y, direction });
  });
  describe('should validate the input', () => {
    test('must be a string', () => {
      expect(app.parsePosition(undefined)).toBeNull();
      expect(app.parsePosition(1)).toBeNull();
      expect(app.parsePosition(null)).toBeNull();
    });
    test('should contain only positive integers, space and valid directions', () => {
      expect(app.parsePosition('0 0 x')).toBeNull();
    });
    test('should be 3 parts', () => {
      expect(app.parsePosition('0 0')).toBeNull();
      expect(app.parsePosition('0 0 N N')).toBeNull();
    });
    test('1st and 2nd part should be numbers', () => {
      expect(app.parsePosition('a 0 N')).toBeNull();
      expect(app.parsePosition('0 a N')).toBeNull();
    });
    test('3rd part should be a valid direction', () => {
      expect(app.parsePosition('0 0 X')).toBeNull();
    });
  });
});

describe('parseInstructions', () => {
  test('should return the original value', () => {
    const instructions = 'LRM';

    expect(app.parseInstructions(instructions)).toEqual(instructions);
  });
  describe('should validate the input', () => {
    test('must be a string', () => {
      expect(app.parseInstructions(undefined)).toBeNull();
      expect(app.parseInstructions(1)).toBeNull();
      expect(app.parseInstructions(null)).toBeNull();
    });
    test('should not be empty', () => {
      expect(app.parseInstructions('')).toBeNull();
    });
    test('should contain valid instructions only', () => {
      expect(app.parseInstructions('X')).toBeNull();
    });
  });
});

describe('navigate', () => {
  test('should reach the destination', () => {
    let destination;

    destination = app.navigate('5 5', '1 2 N', 'LMLMLMLMM');
    expect(destination).toEqual('1 3 N');

    destination = app.navigate('5 5', '3 3 E', 'MMRMMRMRRM');
    expect(destination).toEqual('5 1 E');
  });

  describe('should validate the input', () => {
    test('should be valid inputs, see input parsers above', () => {
      const destination = app.navigate('foo', 'bar');
      expect(destination).toBeNull();
    });

    test('coordinates should be on the map', () => {
      let destination;

      destination = app.navigate('5 5', '13 3 E', 'M');
      expect(destination).toBeNull();

      destination = app.navigate('5 5', '3 13 E', 'M');
      expect(destination).toBeNull();

      destination = app.navigate('5 5', '-1 3 E', 'M');
      expect(destination).toBeNull();

      destination = app.navigate('5 5', '3 -1 E', 'M');
      expect(destination).toBeNull();
    });
  });
});

describe('applyInstruction', () => {
  test('should be a valid instruction', () => {
    const newPosition = app.applyInstruction(null, 'foobar');
    expect(newPosition).toBeNull();
  });
  test('should update direction on L to left', () => {
    const position = { x: 0, y: 0, direction: 'N' };
    const size = { width: 10, height: 10 };

    const newPosition = app.applyInstruction(position, 'L', size);

    expect(newPosition.direction).toBe(app.turnLeft(position.direction));
  });
  test('should update direction on R to right', () => {
    const position = { x: 0, y: 0, direction: 'N' };
    const size = { width: 10, height: 10 };

    const newPosition = app.applyInstruction(position, 'R', size);

    expect(newPosition.direction).toBe(app.turnRight(position.direction));
  });
  test('should update coordinates on M', () => {
    const position = { x: 0, y: 0, direction: 'N' };
    const size = { width: 10, height: 10 };

    const newPosition = app.applyInstruction(position, 'M', size);

    expect(newPosition.x).toBe(app.move(position, size).x);
    expect(newPosition.y).toBe(app.move(position, size).y);
  });
});

describe('turnRight', () => {
  test('should turn clockwise', () => {
    expect(app.turnRight('N')).toBe('E');
    expect(app.turnRight('E')).toBe('S');
    expect(app.turnRight('S')).toBe('W');
    expect(app.turnRight('W')).toBe('N');
  });
});

describe('turnLeft', () => {
  test('should turn anti clockwise', () => {
    expect(app.turnLeft('N')).toBe('W');
    expect(app.turnLeft('W')).toBe('S');
    expect(app.turnLeft('S')).toBe('E');
    expect(app.turnLeft('E')).toBe('N');
  });
});

describe('Move', () => {
  test('should move up, when direction is N', () => {
    const position = { x: 0, y: 0, direction: 'N' };
    const size = { width: 2, height: 2 };
    const newPosition = app.move(position, size);

    expect(newPosition.y).toBe(position.y + 1);
  });
  test('should move right, when direction is E', () => {
    const position = { x: 0, y: 0, direction: 'E' };
    const size = { width: 2, height: 2 };
    const newPosition = app.move(position, size);

    expect(newPosition.x).toBe(position.x + 1);
  });
  test('should move down, when direction is S', () => {
    const position = { x: 0, y: 1, direction: 'S' };
    const size = { width: 2, height: 2 };
    const newPosition = app.move(position, size);

    expect(newPosition.y).toBe(position.y - 1);
  });
  test('should move left, when direction is W', () => {
    const position = { x: 1, y: 0, direction: 'W' };
    const size = { width: 2, height: 2 };
    const newPosition = app.move(position, size);

    expect(newPosition.x).toBe(position.x - 1);
  });
  test('should hit a wall, if tries to go out of plateau', () => {
    const size = { width: 2, height: 2 };
    let position;

    position = { x: 0, y: 0, direction: 'W' };
    expect(app.move(position, size)).toEqual(position);

    position = { x: 0, y: 0, direction: 'S' };
    expect(app.move(position, size)).toEqual(position);

    position = { x: 2, y: 2, direction: 'N' };
    expect(app.move(position, size)).toEqual(position);

    position = { x: 2, y: 2, direction: 'E' };
    expect(app.move(position, size)).toEqual(position);
  });
});
