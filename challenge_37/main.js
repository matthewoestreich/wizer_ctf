module.exports = `<!DOCTYPE html><html>
    <head>
        <title>Help Center Support</title>
    </head>
    <body>
        <h2 id="title">Hello 
            <script nonce="<%=nonce%>">
                document.write((new URLSearchParams(window.location.search).get('name') || 'anonymous'));
            </script>, our support phone number is: <span id="phone"/>
        </h2>
        <script nonce="<%=nonce%>">
            document.getElementById('phone').innerHTML = \`<span id="phone"><%=phone%></span>\`;
        </script>

        <!-- Added for challenge validation purpose - fulfill the condition to get the flag! -->
        <script nonce="<%=nonce%>">
            if(document.documentElement.innerText.indexOf(
                'Dave, please login here to open a ticket') > 0 &&
               document.getElementsByTagName('A')[0].href === 'https://chal15.vercel.app/' &&
               document.documentElement.innerText.indexOf(
                'our support phone number is: <%=phone%>') < 0) {
                alert('Success!');  
            }
        </script>
    </body>
</html>`