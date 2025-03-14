// src/composables/useGlobal.js
import { ref, onMounted } from 'vue'

export function useGlobal() {
    const message = ref('Hello from composable!')

    function greet() {
        console.log(message.value)
    }

    onMounted(() => {
        console.log('Composable mounted!')
    })

    return {
        message,
        greet,
    }
}
