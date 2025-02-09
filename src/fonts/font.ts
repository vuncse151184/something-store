

const Playwrite_VN = (props: { weight: string }) => {
    const { weight } = props
    return {
        className: `font-playwrite_VN font-normal font-sans text-white text-2xl ${weight}`,
    }
}

const Pacifico = (props: { weight: string, preload: boolean, subsets: string[] }) => {
    const { weight, preload, subsets } = props
    return {
        className: `font-pacifico font-normal font-sans text-white text-2xl ${weight}`,
    }
}


export { Playwrite_VN, Pacifico }