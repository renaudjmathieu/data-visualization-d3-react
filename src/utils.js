

export const callAccessor = (accessor, d, i) => (
    typeof accessor === "function" ? accessor(d, i) : accessor
)


