import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import RadioSimpleGroup from '.';
import { STYLE } from './RadioSimpleGroup.constants';
import RadioSimple from '../RadioSimple';
import Text from '../Text';
import Icon from '../Icon';
import SpatialNavigationProvider from '../SpatialNavigationProvider';
import spyOn = jest.spyOn;

jest.mock('uuid', () => {
  return {
    v4: () => '1',
  };
});

describe('<RadioSimpleGroup />', () => {
  const children = [
    <RadioSimple aria-label="Some label" value="red" key="0">
      <Icon key="0" name="accessibility" autoScale />
      <Text key="1" tagName="p">
        Red
      </Text>
    </RadioSimple>,
    <RadioSimple aria-label="Some label" value="blue" key="1">
      <Icon key="0" name="search" autoScale />
      <Text key="1" tagName="p">
        Blue
      </Text>
    </RadioSimple>,
    <RadioSimple aria-label="Some label" value="yellow" key="2">
      <Icon key="0" name="accessories" autoScale />
      <Text key="1" tagName="p">
        Yellow
      </Text>
    </RadioSimple>,
  ];
  const label = <div>Select your favorite color</div>;
  const description = <div>Only choose one</div>;

  describe('snapshot', () => {
    it('should match snapshot', () => {
      expect.assertions(1);

      const { asFragment } = render(
        <RadioSimpleGroup children={children} label={label} description={description} />
      );

      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with children', () => {
      expect.assertions(1);

      const { asFragment } = render(
        <RadioSimpleGroup aria-label="Some label" children={children} />
      );

      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with className', () => {
      expect.assertions(1);

      const className = 'example-className';

      const { asFragment } = render(
        <RadioSimpleGroup aria-label="Some label" children={children} className={className} />
      );

      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with id', () => {
      expect.assertions(1);

      const id = 'example-id';

      const { asFragment } = render(
        <RadioSimpleGroup aria-label="Some label" children={children} id={id} />
      );

      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with style', () => {
      expect.assertions(1);

      const style = { color: 'pink' };

      const { asFragment } = render(
        <RadioSimpleGroup aria-label="Some label" children={children} style={style} />
      );

      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with description', () => {
      expect.assertions(1);

      const { asFragment } = render(
        <RadioSimpleGroup
          aria-label="Some label"
          children={children}
          description={description}
          id="example-id"
        />
      );

      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with child thats selected', () => {
      expect.assertions(1);

      const { asFragment } = render(
        <RadioSimpleGroup aria-label="Some label" children={children} defaultValue="red" />
      );

      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with children with group disabled', () => {
      expect.assertions(1);

      const { asFragment } = render(
        <RadioSimpleGroup aria-label="Some label" children={children} isDisabled={true} />
      );

      expect(asFragment()).toMatchSnapshot();
    });

    it('should match snapshot with children with read only', () => {
      expect.assertions(1);

      const { asFragment } = render(
        <RadioSimpleGroup aria-label="Some label" children={children} isReadOnly={true} />
      );

      expect(asFragment()).toMatchSnapshot();
    });
  });

  describe('attributes', () => {
    it('should have its default wrapper class', () => {
      expect.assertions(1);

      render(<RadioSimpleGroup children={children} label={label} description={description} />);

      const radioGroup = screen.getByRole('radiogroup');

      expect(radioGroup).toHaveClass(STYLE.wrapper);
    });

    it('should have provided aria-describedby when description is provided', () => {
      expect.assertions(1);

      render(
        <RadioSimpleGroup
          aria-label="Some label"
          children={children}
          description={description}
          id="example-id"
        />
      );

      const radioGroup = screen.getByRole('radiogroup');

      expect(radioGroup).toHaveAttribute(
        'aria-describedby',
        'radio-simple-group-description-example-id'
      );
    });

    it('should have provided class when className is provided', () => {
      expect.assertions(1);

      const className = 'example-className';

      render(
        <RadioSimpleGroup aria-label="Some label" children={children} className={className} />
      );

      const radioGroup = screen.getByRole('radiogroup');

      expect(radioGroup).toHaveClass(className);
    });

    it('should have provided id when id is provided', () => {
      expect.assertions(1);

      const id = 'example-id';

      render(<RadioSimpleGroup aria-label="Some label" children={children} id={id} />);

      const radioGroup = screen.getByRole('radiogroup');

      expect(radioGroup.id).toBe(id);
    });

    it('should have provided style when style is provided', () => {
      expect.assertions(1);

      const style = { color: 'pink' };
      const styleString = 'color: pink;';

      render(<RadioSimpleGroup aria-label="Some label" children={children} style={style} />);

      const radioGroup = screen.getByRole('radiogroup');

      expect(radioGroup).toHaveStyle(styleString);
    });

    it('should have provided isReadOnly when isReadOnly is provided', () => {
      expect.assertions(1);

      render(<RadioSimpleGroup aria-label="Some label" children={children} isReadOnly={true} />);

      const radioGroup = screen.getByRole('radiogroup');

      expect(radioGroup).toHaveAttribute('aria-readonly', 'true');
    });

    it('should have provided isDisabled when isDisabled is provided', () => {
      expect.assertions(1);

      render(<RadioSimpleGroup aria-label="Some label" children={children} isDisabled={true} />);

      const radioGroup = screen.getByRole('radiogroup');

      expect(radioGroup).toHaveAttribute('aria-disabled', 'true');
    });

    it('should give only the select element the selected style', () => {
      expect.assertions(3);

      render(<RadioSimpleGroup aria-label="Some label" children={children} defaultValue={'red'} />);

      const optionRed = screen.getByLabelText('Red');
      const optionBlue = screen.getByLabelText('Blue');
      const optionYellow = screen.getByLabelText('Yellow');

      expect(optionRed).toBeChecked();
      expect(optionBlue).not.toBeChecked();
      expect(optionYellow).not.toBeChecked();
    });
  });

  describe('actions', () => {
    it('should change which child is selected when clicked', async () => {
      expect.assertions(9);
      const user = userEvent.setup();

      render(<RadioSimpleGroup aria-label="Some label">{children}</RadioSimpleGroup>);

      const optionRed = screen.getByLabelText('Red');
      const optionBlue = screen.getByLabelText('Blue');
      const optionYellow = screen.getByLabelText('Yellow');

      await user.click(optionRed);

      expect(optionRed).toBeChecked();
      expect(optionBlue).not.toBeChecked();
      expect(optionYellow).not.toBeChecked();

      await user.click(optionBlue);

      expect(optionBlue).toBeChecked();
      expect(optionYellow).not.toBeChecked();
      expect(optionRed).not.toBeChecked();

      await user.click(optionYellow);

      expect(optionYellow).toBeChecked();
      expect(optionRed).not.toBeChecked();
      expect(optionBlue).not.toBeChecked();
    });

    it('should call onChange when child is clicked', async () => {
      expect.assertions(1);
      const user = userEvent.setup();

      const onChange = jest.fn();

      render(
        <RadioSimpleGroup aria-label="Some label" onChange={onChange}>
          {children}
        </RadioSimpleGroup>
      );

      const optionRed = screen.getByLabelText('Red');

      await user.click(optionRed);

      expect(onChange).toBeCalledWith('red');
    });

    it('should not call onChange when default value is clicked first', async () => {
      expect.assertions(1);
      const user = userEvent.setup();

      const onChange = jest.fn();

      render(
        <RadioSimpleGroup aria-label="Some label" defaultValue={'red'} onChange={onChange}>
          {children}
        </RadioSimpleGroup>
      );

      const optionRed = screen.getByText('Red');

      await user.click(optionRed);

      expect(onChange).not.toBeCalled();
    });

    it('should call onChange only once when a child is clicked several times', async () => {
      expect.assertions(2);
      const user = userEvent.setup();

      const onChange = jest.fn();

      render(
        <RadioSimpleGroup aria-label="Some label" onChange={onChange}>
          {children}
        </RadioSimpleGroup>
      );

      const optionRed = screen.getByLabelText('Red');

      await user.click(optionRed);

      expect(onChange).toBeCalledWith('red');
      expect(onChange).toBeCalledTimes(1);
    });

    it('should not call onChange when the group is readonly and a child is clicked', async () => {
      expect.assertions(1);
      const user = userEvent.setup();

      const onChange = jest.fn();

      render(
        <RadioSimpleGroup aria-label="Some label" isReadOnly={true} onChange={onChange}>
          {children}
        </RadioSimpleGroup>
      );

      const optionRed = screen.getByText('Red');

      await user.click(optionRed);

      expect(onChange).not.toBeCalled();
    });

    it('should not call onChange when the group is disabled and a child is clicked', async () => {
      expect.assertions(1);
      const user = userEvent.setup();

      const onChange = jest.fn();

      render(
        <RadioSimpleGroup aria-label="Some label" isDisabled={true} onChange={onChange}>
          {children}
        </RadioSimpleGroup>
      );

      const optionRed = screen.getByText('Red');

      await user.click(optionRed);

      expect(onChange).not.toBeCalled();
    });

    it('should not call onChange when a disabled child is clicked', async () => {
      expect.assertions(4);
      const user = userEvent.setup();

      const onChange = jest.fn();

      render(
        <RadioSimpleGroup aria-label="Some label" onChange={onChange}>
          <RadioSimple aria-label="Some label" value="red" key="0" isDisabled={true}>
            <Icon name="accessibility" autoScale />
            <Text tagName="p">Red</Text>
          </RadioSimple>
          ,
          <RadioSimple aria-label="Some label" value="blue" key="1">
            <Icon name="search" autoScale />
            <Text tagName="p">Blue</Text>
          </RadioSimple>
          ,
          <RadioSimple aria-label="Some label" value="yellow" key="2">
            <Icon name="accessories" autoScale />
            <Text tagName="p">Yellow</Text>
          </RadioSimple>
        </RadioSimpleGroup>
      );

      const optionRed = screen.getByLabelText('Red');

      expect(optionRed).toBeDisabled();

      await user.click(optionRed);

      expect(onChange).not.toBeCalled();

      const optionYellow = screen.getByLabelText('Yellow');

      expect(optionYellow).not.toBeDisabled();

      await user.click(optionYellow);

      expect(onChange).toBeCalled();
    });

    it('should allow keyboard navigation', async () => {
      expect.assertions(6);
      const user = userEvent.setup();

      const onChange = jest.fn();

      render(
        <RadioSimpleGroup aria-label="Some label" onChange={onChange} defaultValue="red">
          {children}
        </RadioSimpleGroup>
      );

      const optionRed = screen.getByLabelText('Red');
      const optionBlue = screen.getByLabelText('Blue');
      const optionYellow = screen.getByLabelText('Yellow');

      await user.type(optionRed, '{arrowdown}');

      expect(onChange).toHaveBeenLastCalledWith('blue');

      await user.type(optionBlue, '{arrowdown}');

      expect(onChange).toHaveBeenLastCalledWith('yellow');

      await user.type(optionYellow, '{arrowdown}');

      expect(onChange).toHaveBeenLastCalledWith('red');

      await user.type(optionYellow, '{arrowup}');

      expect(onChange).toHaveBeenLastCalledWith('blue');

      await user.type(optionBlue, '{arrowup}');

      expect(onChange).toHaveBeenLastCalledWith('red');

      await user.type(optionRed, '{arrowup}');

      expect(onChange).toHaveBeenLastCalledWith('yellow');
    });

    it('should focus selected child on keyboard input', async () => {
      expect.assertions(5);
      const user = userEvent.setup();

      const onChange = jest.fn();

      render(
        <RadioSimpleGroup aria-label="Some label" onChange={onChange}>
          {children}
        </RadioSimpleGroup>
      );

      const optionRed = screen.getByLabelText('Red');
      const optionBlue = screen.getByLabelText('Blue');

      await user.tab();

      expect(optionRed).toHaveFocus();
      expect(onChange).not.toBeCalled();

      await user.type(optionRed, '{arrowdown}');

      expect(optionBlue).toHaveFocus();
      expect(optionBlue).toBeChecked();

      expect(onChange).toBeCalledWith('blue');
    });

    describe('with spatial navigation', () => {
      function setup() {
        const user = userEvent.setup();

        render(
          <SpatialNavigationProvider>
            <button>before</button>
            <RadioSimpleGroup aria-label="Some label">{children}</RadioSimpleGroup>
            <button>after</button>
          </SpatialNavigationProvider>
        );

        const btnBefore = screen.getByText('before');
        const optionRed = screen.getByLabelText('Red');
        const optionBlue = screen.getByLabelText('Blue');
        const optionYellow = screen.getByLabelText('Yellow');
        const btnAfter = screen.getByText('after');

        // jsDOM returns 0 for all values, so we need to mock them
        [btnBefore, optionRed, optionBlue, optionYellow, btnAfter].forEach((e, idx) => {
          const y = idx * 20 + 10;
          jest.spyOn(e, 'getBoundingClientRect').mockReturnValue({
            x: 0,
            y,
            top: y,
            left: 0,
            bottom: y + 10,
            right: 100,
            width: 100,
            height: 10,
          } as any);
        });

        btnBefore.focus();
        return { user, btnBefore, optionRed, optionBlue, optionYellow, btnAfter };
      }

      it('should work normally but not looping back when up and down arrows pressed', async () => {
        expect.assertions(5);

        const { user, btnBefore, optionRed, optionBlue, optionYellow, btnAfter } = setup();

        await user.keyboard('{ArrowDown}');
        expect(optionRed).toHaveFocus();

        await user.keyboard('{ArrowDown}');
        await user.keyboard('{ArrowDown}');
        expect(optionYellow).toHaveFocus();

        await user.keyboard('{ArrowDown}');
        expect(btnAfter).toHaveFocus();

        await user.keyboard('{ArrowUp}');
        await user.keyboard('{ArrowUp}');
        expect(optionBlue).toHaveFocus();

        await user.keyboard('{ArrowUp}');
        await user.keyboard('{ArrowUp}');
        expect(btnBefore).toHaveFocus();
      });
    });
  });
});
