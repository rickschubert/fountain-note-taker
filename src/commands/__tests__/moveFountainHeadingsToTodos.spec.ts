import {replaceMarkdownHeadingAfterUuidWithNewHeading} from "../moveFountainHeadingsToTodos"

describe("Moving headings from fountain script into correlating todo sections", () => {
    it("Adds new heading if heading was not yet present", () => {
        const uuid = "c0ab248e-6e66-4023-b283-13e8021639f0"
        const newHeading = "A random new heading up in here!"
        const fullTodoContentBefore = `
# 2-1
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd

<!-- c0ab248e-6e66-4023-b283-13e8021639f0 -->
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd

<!-- 07532be5-5d07-4d11-ad12-7c11f3c06792 -->
# 2-5
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd

# 2-6
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
        `

        const fullTodoContentAfter = `
# 2-1
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd

<!-- c0ab248e-6e66-4023-b283-13e8021639f0 -->
# ${newHeading}
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd

<!-- 07532be5-5d07-4d11-ad12-7c11f3c06792 -->
# 2-5
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd

# 2-6
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
        `

        const newTodoContent = replaceMarkdownHeadingAfterUuidWithNewHeading(
            fullTodoContentBefore,
            uuid,
            newHeading
        )

        expect(newTodoContent).toEqual(fullTodoContentAfter)
    })

    it("Replaces previous heading if heading was already present", () => {
        const uuid = "07532be5-5d07-4d11-ad12-7c11f3c06792"
        const newHeading = "A random new heading up in here!"
        const fullTodoContentBefore = `
# 2-1
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd

<!-- 07532be5-5d07-4d11-ad12-7c11f3c06792 -->
# 2-4
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd

<!-- c0ab248e-6e66-4023-b283-13e8021639f0 -->
# 2-5
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd

# 2-6
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
        `

        const fullTodoContentAfter = `
# 2-1
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd

<!-- 07532be5-5d07-4d11-ad12-7c11f3c06792 -->
# ${newHeading}
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd

<!-- c0ab248e-6e66-4023-b283-13e8021639f0 -->
# 2-5
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd

# 2-6
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
- asdfdsf ashjlf halskf hsdalfj hasdjfkl saklfd ajklhsd
        `

        const newTodoContent = replaceMarkdownHeadingAfterUuidWithNewHeading(
            fullTodoContentBefore,
            uuid,
            newHeading
        )

        expect(newTodoContent).toEqual(fullTodoContentAfter)
    })
})
