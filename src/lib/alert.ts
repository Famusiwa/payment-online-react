import Swal from 'sweetalert2';
type AlertIcon = 'success' | 'error' | 'warning' | 'info';

export const showAlert = ( 
    text: string = '', 
    icon: AlertIcon = 'error',
    title: string = 'Notification', 
) => {
    return Swal.fire({
        icon,
        title,
        text,
        confirmButtonColor: 'var(--color-primary)', // Use CSS variable
    });
};
//example
// showAlert("testing");


export const showConfirmation = async (text: string = '', title: string = 'Are you sure?', confirmButtonText: string = 'Yes', cancelButtonText: string = 'No') => {
    const result = await Swal.fire({
        icon: 'question',
        title,
        text,
        showCancelButton: true,
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText,
        confirmButtonColor: 'var(--color-primary)', 
        cancelButtonColor: 'var(--color-secondary)',
    });

    return {
        confirmed: result.isConfirmed,
        dismissed: result.isDismissed,
        dismiss: result.dismiss // Returns 'cancel', 'backdrop', 'close', 'esc' or undefined
    };
};
//Usage example
// showConfirmation("Hello World", "warning").then((result: any) =>
//             console.log(result)
//           )

export const showHtmlAlert = (htmlContent: string, title: string = 'Notification') => {
    return Swal.fire({
        title,
        html: htmlContent,
        confirmButtonColor: 'var(--color-primary)', // Use CSS variable
        confirmButtonText: 'Okay',
    });
};
// Usage example
// showHtmlAlert('<p>This is <strong>HTML</strong> content!</p>');