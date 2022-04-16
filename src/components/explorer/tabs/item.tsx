import CancelIcon from 'iconoir/icons/cancel.svg';
import {useNavigate} from 'solid-app-router';
import type {JSXElement} from 'solid-js';
import {createSignal, mergeProps} from 'solid-js';
import {Button} from 'src/components/base';
import {toExplorer} from 'src/routes';

type Props = {
  title: string;
  isActive?: boolean;
  allowClose?: boolean;
  onClose?: () => void;
};

export const Tab = (props: Props): JSXElement => {
  props = mergeProps({allowClose: true}, props);
  const navigate = useNavigate();
  const [isHovered, setHovered] = createSignal(false);

  /** @tw */
  const active = 'bg-app';
  /** @tw */
  const width = 'min-w-20 sm:max-w-30 md:max-w-40 lg:max-w-50';
  /** @tw */
  const color = 'hover:bg-hover transition-colors duration-100';

  return (
    <div
      onClick={() => navigate(toExplorer(props.title))}
      class={`flex items-center h-full p-3 border-gray border-r-1 cursor-pointer select-none ${width} ${color}`}
      classList={{[active]: props.isActive}}
      onMouseOver={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span class='overflow-hidden whitespace-nowrap overflow-ellipsis'>{props.title}</span>
      <Button
        size='sm'
        variant='ghost'
        class='p-0 h-6 hover:bg-slate-100 hover:bg-opacity-10'
        style={{
          visibility: props.allowClose && (isHovered() || props.isActive) ? 'visible' : 'hidden',
        }}
        onClick={(event) => {
          event.stopPropagation();
          props.onClose?.();
        }}
      >
        <CancelIcon />
      </Button>
    </div>
  );
};
