import CancelIcon from 'iconoir/icons/cancel.svg';
import {useNavigate} from 'solid-app-router';
import type {JSXElement} from 'solid-js';
import {createSignal, mergeProps} from 'solid-js';
import {Button} from 'src/components/base';

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
  const width = 'min-w-20 sm:max-w-30 md:max-w-40 lg:max-w-50';
  /** @tw */
  const active = 'bg-app';

  return (
    <div
      onClick={() => navigate(`/explorer/${props.title}`)}
      class={`flex items-center ${width} p-3 border-gray border-r-1 h-full hover:bg-hover cursor-pointer`}
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
