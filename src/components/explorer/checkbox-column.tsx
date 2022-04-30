import type {JSXElement} from 'solid-js';
import {splitProps} from 'solid-js';
import type {CheckboxProps} from 'src/components/base';
import {Checkbox} from 'src/components/base';
import {zIndex} from 'src/styles';

type Props = CheckboxProps & {
  isHeader?: boolean;
};

export const CheckboxColumn = (props: Props): JSXElement => {
  const [ownProps, checkboxProps] = splitProps(props, ['isHeader']);

  return (
    <div
      class={`${zIndex.COL_HEADER} sticky left-0 flex items-center justify-center h-10 w-10 min-w-10 border-b-2 border-slate-700 bg-app`}
      classList={{'border-t-2': ownProps.isHeader, 'shadow-light-right': !ownProps.isHeader}}
    >
      <Checkbox {...checkboxProps} />
    </div>
  );
};
