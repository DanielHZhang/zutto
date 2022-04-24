import type {JSXElement} from 'solid-js';
import {splitProps} from 'solid-js';
import type {CheckboxProps} from 'src/components/base';
import {Checkbox} from 'src/components/base';

type Props = CheckboxProps & {
  isHeader?: boolean;
};

export const CheckboxColumn = (props: Props): JSXElement => {
  const [ownProps, checkboxProps] = splitProps(props, ['isHeader']);

  return (
    <div
      class='sticky left-0 flex items-center justify-center h-10 w-10 min-w-10 border-b-2 border-slate-700 bg-app z-10'
      classList={{'border-t-2': !!ownProps.isHeader}}
    >
      <Checkbox {...checkboxProps} />
    </div>
  );
};
