import {createGlobalStyles as styled} from 'solid-styled-components';

export const GlobalStyles = styled`
	::-webkit-scrollbar {
		background-color: #1a212e;
		width: 16px;
		height: 16px;

		&-thumb {
			min-height: 40px;
			background-color: #111520ee;
		}

		&-thumb, &-track {
			background-clip: padding-box;
			border: 4px solid transparent;
			border-radius: 8px;
		}

		&-track {
			background-color: #212a3f;
		}

		&-corner {
			background-color: transparent;
		}
	}
`;
