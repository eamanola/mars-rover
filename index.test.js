const app = require('./index');

describe('navigate()', () => {
  test('converts plateau-size, initial-position, and instruction input strings to final destination string', () => {
    let destination;

    destination = app.navigate('5 5', '1 2 N', 'LMLMLMLMM');
    expect(destination).toEqual('1 3 N');

    destination = app.navigate('5 5', '3 3 E', 'MMRMMRMRRM');
    expect(destination).toEqual('5 1 E');
  });

  describe('returns null on invalid input', () => {
    test('if any #input parser returns null', () => {
      const destination = app.navigate('foobar');
      expect(destination).toBeNull();
    });

    test('if initial-position is out of plateau', () => {
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

describe('#input parsers: to parse and validate user inputs', () => {
  describe('parsePlateauSize()', () => {
    test('converts plateau-size input string to obj { width, height }', () => {
      const width = 5;
      const height = 6;
      const plateauSize = app.parsePlateauSize(`${width} ${height}`);
      expect(plateauSize).toEqual({ width, height });
    });

    describe('returns null on invalid input', () => {
      test('must be a string', () => {
        expect(app.parsePlateauSize(undefined)).toBeNull();
        expect(app.parsePlateauSize(1)).toBeNull();
        expect(app.parsePlateauSize(null)).toBeNull();
      });

      test('should contain 2 space separated numbers', () => {
        expect(app.parsePlateauSize('0')).toBeNull();
        expect(app.parsePlateauSize('00')).toBeNull();
        expect(app.parsePlateauSize('0 0 0')).toBeNull();
      });
    });
  });

  describe('parsePosition()', () => {
    test('converts initial-position input string to obj { x, y, direction }', () => {
      const x = 5;
      const y = 6;
      const direction = 'N';

      const position = app.parsePosition(`${x} ${y} ${direction}`);
      expect(position).toEqual({ x, y, direction });
    });

    describe('returns null on invalid input', () => {
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
        expect(app.parsePosition('0 0 N')).not.toBeNull();
        expect(app.parsePosition('0 0 N N')).toBeNull();
        expect(app.parsePosition('00N')).toBeNull();
      });

      test('1st and 2nd part should be numbers', () => {
        expect(app.parsePosition('a 0 N')).toBeNull();
        expect(app.parsePosition('0 a N')).toBeNull();
        expect(app.parsePosition('0 0 N')).not.toBeNull();
      });

      test('3rd part should be a valid direction [NSEW]', () => {
        expect(app.parsePosition('0 0 X')).toBeNull();
        expect(app.parsePosition('0 0 N')).not.toBeNull();
        expect(app.parsePosition('0 0 S')).not.toBeNull();
        expect(app.parsePosition('0 0 E')).not.toBeNull();
        expect(app.parsePosition('0 0 W')).not.toBeNull();
      });
    });
  });

  describe('parseInstructions()', () => {
    test('validates and returns the original instruction input string', () => {
      const instructions = 'LRM';

      expect(app.parseInstructions(instructions)).toEqual(instructions);
    });

    describe('returns null on invalid input', () => {
      test('must be a string', () => {
        expect(app.parseInstructions(undefined)).toBeNull();
        expect(app.parseInstructions(1)).toBeNull();
        expect(app.parseInstructions(null)).toBeNull();
      });

      test('should not be empty', () => {
        expect(app.parseInstructions('')).toBeNull();
      });

      test('should contain valid instructions only [MRL]', () => {
        expect(app.parseInstructions('X')).toBeNull();
        expect(app.parseInstructions('M')).not.toBeNull();
        expect(app.parseInstructions('L')).not.toBeNull();
        expect(app.parseInstructions('R')).not.toBeNull();
      });
    });
  });
});

describe('applyInstruction()', () => {
  describe('takes an instruction, and updates the position', () => {
    test('updates direction to left on L', () => {
      const position = { x: 0, y: 0, direction: 'N' };
      const size = { width: 10, height: 10 };

      const newPosition = app.applyInstruction(position, 'L', size);

      expect(newPosition.direction).toBe(app.turnLeft(position.direction));
    });

    test('updates direction to right on R', () => {
      const position = { x: 0, y: 0, direction: 'N' };
      const size = { width: 10, height: 10 };

      const newPosition = app.applyInstruction(position, 'R', size);

      expect(newPosition.direction).toBe(app.turnRight(position.direction));
    });

    test('updates coordinates on M', () => {
      const position = { x: 0, y: 0, direction: 'N' };
      const size = { width: 10, height: 10 };

      const newPosition = app.applyInstruction(position, 'M', size);

      expect(newPosition.x).toBe(app.move(position, size).x);
      expect(newPosition.y).toBe(app.move(position, size).y);
    });
  });
});

describe('turnRight()', () => {
  test('turns direction clockwise', () => {
    expect(app.turnRight('N')).toBe('E');
    expect(app.turnRight('E')).toBe('S');
    expect(app.turnRight('S')).toBe('W');
    expect(app.turnRight('W')).toBe('N');
  });
});

describe('turnLeft()', () => {
  test('turns direction anti clockwise', () => {
    expect(app.turnLeft('N')).toBe('W');
    expect(app.turnLeft('W')).toBe('S');
    expect(app.turnLeft('S')).toBe('E');
    expect(app.turnLeft('E')).toBe('N');
  });
});

describe('Move()', () => {
  describe('updates coordinates, with 1 step, based on direction', () => {
    test('moves up, when direction is N', () => {
      const position = { x: 0, y: 0, direction: 'N' };
      const size = { width: 2, height: 2 };
      const newPosition = app.move(position, size);

      expect(newPosition.y).toBe(position.y + 1);
    });

    test('moves right, when direction is E', () => {
      const position = { x: 0, y: 0, direction: 'E' };
      const size = { width: 2, height: 2 };
      const newPosition = app.move(position, size);

      expect(newPosition.x).toBe(position.x + 1);
    });

    test('moves down, when direction is S', () => {
      const position = { x: 0, y: 1, direction: 'S' };
      const size = { width: 2, height: 2 };
      const newPosition = app.move(position, size);

      expect(newPosition.y).toBe(position.y - 1);
    });

    test('moves left, when direction is W', () => {
      const position = { x: 1, y: 0, direction: 'W' };
      const size = { width: 2, height: 2 };
      const newPosition = app.move(position, size);

      expect(newPosition.x).toBe(position.x - 1);
    });
  });

  describe('if rover going out of plateau', () => {
    test('ignores move command, ', () => {
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
});
