let authentified = $state(false);

export const isAuthentified = () => authentified;

export const setAuthentified = (value: boolean) => {
	authentified = value;
};
