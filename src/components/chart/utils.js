import { useEffect, useState, useRef } from "react"
import ResizeObserver from "resize-observer-polyfill"

export const callAccessor = (accessor, d, i) => (
    typeof accessor === "function" ? accessor(d, i) : accessor
)

export const combineChartDimensions = dimensions => {
    let parsedDimensions = {
        marginTop: 40,
        marginRight: 30,
        marginBottom: 40,
        marginLeft: 75,
        ...dimensions,
    }

    return {
        ...parsedDimensions,
        boundedHeight: Math.max(parsedDimensions.height - parsedDimensions.marginTop - parsedDimensions.marginBottom, 0),
        boundedWidth: Math.max(parsedDimensions.width - parsedDimensions.marginLeft - parsedDimensions.marginRight, 0),
    }
}

export const useChartDimensions = passedSettings => {
    const ref = useRef()
    const dimensions = combineChartDimensions(passedSettings)

    const [width, changeWidth] = useState(0)
    const [height, changeHeight] = useState(0)

    useEffect(() => {
        if (dimensions.width && dimensions.height) return [ref, dimensions]

        const element = ref.current
        const resizeObserver = new ResizeObserver(entries => {
            if (!Array.isArray(entries)) return
            if (!entries.length) return

            const entry = entries[0]

            let resizeTimer;
            if (width !== entry.contentRect.width || height !== entry.contentRect.height) {
                document.body.classList.add("resize-animation-stopper");
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    document.body.classList.remove("resize-animation-stopper");
                }, 300);
            }

            if (width !== entry.contentRect.width) changeWidth(entry.contentRect.width)
            if (height !== entry.contentRect.height) changeHeight(entry.contentRect.height)
        })

        resizeObserver.observe(element)

        return () => resizeObserver.unobserve(element)
    }, [passedSettings, height, width, dimensions])

    const newSettings = combineChartDimensions({
        ...dimensions,
        width: dimensions.width || width,
        height: dimensions.height || height,
        offsetTop: dimensions.offsetTop || ref.current?.offsetTop,
        offsetLeft: dimensions.offsetLeft || ref.current?.offsetLeft,
    })

    return [ref, newSettings]
}
