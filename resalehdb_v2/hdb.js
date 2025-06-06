// Taken from https://sgp.fyi/. All credits go to the original developer.

var addressList = new Array,
    blockList = new Array,
    streetList = new Array,
    latList = new Array,
    lonList = new Array,
    postalList = new Array,
    autorepeatcounter = 0,
    hotblockArray = new Array,
    currentblockheatIndex = 0;
let dictionaryx = {
    STREET: "ST",
    SAINT: "ST.",
    DRIVE: "DR",
    ROAD: "RD",
    AVENUE: "AVE",
    NORTH: "NTH",
    SOUTH: "STH",
    CENTRAL: "CTRL",
    CRESCENT: "CRES",
    PLACE: "PL",
    COMMONWEALTH: "C'WEALTH",
    CLOSE: "CL",
    PARK: "PK",
    JALAN: "JLN",
    BUKIT: "BT",
    KAMPONG: "KG",
    LORONG: "LOR",
    TERRACE: "TER",
    MARKET: "MKT",
    UPPER: "UPP",
    GARDENS: "GDNS",
    HEIGHTS: "HTS",
    TANJONG: "TG"
};
var newEntry, chartArray = new Array,
    plotArrayX = new Array,
    plotArrayY = new Array,
    plotArrayR = new Array,
    randColoredBubblesArray = new Array,
    minmaxFinder = new Array;


// Checks if the input e is at least 3 characters long. If it is, it calls checkAddr(e).
function minTest(e) {
    e.length < 3 || checkAddr(e)
}

// Reads URL parameters to pre-fill a search and constructs a map image using coordinates (l1, l2) from the OneMap static map API. Calls getTransactions() to fetch transaction data for that address.
function checkReferral() {
    let a = new URLSearchParams(window.location.search);
    if (a.has("ref") && a.get("l1") && a.get("l2")) {
        let e = a.get("ref");
        var n, s, o = a.get("l1"),
            l = a.get("l2");
        let t = screen.width;
        t = 400 < t ? 400 : 320;
        let r = /[`!@#$%^&*()_+\-=\[\]{};:"\\|,<>\/?~]/;
        r.test(e) || (document.getElementById("search").value = e, document.getElementById("search").innerHTML = e, document.getElementById("search").disabled = !0, n = e.substring(0, e.indexOf(" ")), s = e.substring(e.indexOf(" ") + 1, e.length), l = '<a href="https://maps.google.com/?q=' + o + "," + l + '" target="_blank"><img src=' + ("https://www.onemap.gov.sg/api/staticmap/getStaticImage?layerchosen=original&latitude=" + o + "&longitude=" + l + "&points=" + ("[" + o + "," + l + ',"255,8,0"]') + "&zoom=17&width=" + t + "&height=" + t) + "></a>", document.getElementById("maparea").innerHTML = l, getTransactions(s, n))
    }
}

// Returns a random semi-transparent RGBA color, likely for charting or plotting colored bubbles on a visual map or graph.
function getRandomColor() {
    return "rgba(" + Math.floor(255 * Math.random()) + "," + Math.floor(255 * Math.random()) + "," + Math.floor(255 * Math.random()) + ", 0.5)"
}

// Converts large numbers to "K" format (e.g. 1200 → "1.2K"). Likely to shorten display of transaction volume or prices.
function kFormatter(e) {
    return 999 < Math.abs(e) ? Math.sign(e) * (Math.abs(e) / 1e3).toFixed(1) + "K" : Math.sign(e) * Math.abs(e)
}

// Clears all search results and resets the search input field.
function clearAll() {
    addpressList = new Array, blockList = new Array, streetList = new Array, latList = new Array, lonList = new Array, postalList = new Array, chartArray = new Array, plotArrayX = new Array, plotArrayY = new Array, plotArrayR = new Array, hotblockArray = new Array, currentblockheatIndex = 0, randColoredBubblesArray = new Array, minmaxFinder = new Array, document.getElementById("search").value = "", document.getElementById("searchaddress").innerHTML = 'Singapore public housing "hdb" resale transactions search', document.getElementById("searchstatus").innerHTML = "<h5>Enter the postal code / address and use autocomplete to ensure search accuracy</h5>", document.getElementById("transactiongraph").innerHTML = "", document.getElementById("transactionresults").innerHTML = "", document.getElementById("maparea").innerHTML = '<img src="images/sgp.jpg">', document.getElementById("search").disabled = !1, document.getElementById("search").focus(), refAddress = "", autorepeatcounter = 0
}

// Performs an AJAX request to the OneMap API to search for addresses matching the input e.
// Updates the search autocomplete list with the results.
function checkAddr(e) {
    $.ajax({
        url: "https://www.onemap.gov.sg/api/common/elastic/search?searchVal=" + e + "&returnGeom=Y&getAddrDetails=Y&pageNum=1",
        success: function(e) {
            var t = JSON.stringify(e),
                r = (e.found, JSON.parse(t));
            addressList = new Array, blockList = new Array, streetList = new Array, latList = new Array, lonList = new Array, postalList = new Array;
            for (let e = 0; e < r.results.length; e++) resAddress = r.results[e].ADDRESS, resBlock = r.results[e].BLK_NO, resStreet = r.results[e].ROAD_NAME, resLat = r.results[e].LATITUDE, resLon = r.results[e].LONGITUDE, resPost = r.results[e].POSTAL, addressList.push(resAddress), blockList.push(resBlock), streetList.push(resStreet), latList.push(resLat), lonList.push(resLon), postalList.push(resPost);
            t = document.getElementById("search");
            new Awesomplete(t).list = addressList
        }
    })
}

// Toggles the visibility of an element with the given ID.
function expand(e) {
    e = document.getElementById(e); - 1 == e.className.indexOf("w3-show") ? e.className += " w3-show" : e.className = e.className.replace(" w3-show", "")
}

// Sorts the table rows based on the column index e.
// Uses bubble sort algorithm to sort the rows.
// The sort order can be ascending or descending, controlled by the c variable.
// The function modifies the DOM directly to update the table display.
function sortTable(e) {
    for (var t, r, a, n, s, o = 0, l = document.getElementById("resultTable"), i = !0, c = "asc"; i;) {
        for (i = !1, t = l.rows, r = 1; r < t.length - 1; r++)
            if (s = !1, a = t[r].getElementsByTagName("TD")[e], n = t[r + 1].getElementsByTagName("TD")[e], "asc" == c) {
                if (a.innerHTML.toLowerCase() > n.innerHTML.toLowerCase()) {
                    s = !0;
                    break
                }
            } else if ("desc" == c && a.innerHTML.toLowerCase() < n.innerHTML.toLowerCase()) {
            s = !0;
            break
        }
        s ? (t[r].parentNode.insertBefore(t[r + 1], t[r]), i = !0, o++) : 0 == o && "asc" == c && (c = "desc", i = !0)
    }
}

// Same as sortTable but for the hood table.
function sortHood(e) {
    for (var t, r, a, n, s, o = 0, l = document.getElementById("hoodTable"), i = !0, c = "asc"; i;) {
        for (i = !1, t = l.rows, r = 1; r < t.length - 1; r++)
            if (s = !1, a = t[r].getElementsByTagName("TD")[e], n = t[r + 1].getElementsByTagName("TD")[e], "asc" == c) {
                if (a.innerHTML.toLowerCase() > n.innerHTML.toLowerCase()) {
                    s = !0;
                    break
                }
            } else if ("desc" == c && a.innerHTML.toLowerCase() < n.innerHTML.toLowerCase()) {
            s = !0;
            break
        }
        s ? (t[r].parentNode.insertBefore(t[r + 1], t[r]), i = !0, o++) : 0 == o && "asc" == c && (c = "desc", i = !0)
    }
}

// Fetches nearby HDB blocks and resale transaction counts using a heatmap API.
function getHotHood(y) {
    var T, w, f = "";
    pindescription = 0;
    let A = screen.width;
    A = 400 < A ? 400 : 320;
    fetch("https://mbq6a85ywi.execute-api.ap-southeast-1.amazonaws.com/getHeatMap?blkstreet=" + y, {
        method: "GET",
        redirect: "follow"
    }).then(e => e.json()).then(e => resultobject = e).then(() => {
        let r = resultobject.length;
        if ("no results!" == resultobject && (r = 0), resultobject) {
            for (let e = 0; e < r; e++) {
                var a = resultobject[e].Address,
                    n = (resultobject[e].Start, resultobject[e].MaxFloor, resultobject[e].TotalUnits, resultobject[e].Postal),
                    s = resultobject[e].TransCount,
                    o = resultobject[e].lat,
                    l = resultobject[e].lon;
                hotblockArray.push(s), a == y && (currentblockheatIndex = s, w = o, T = l, 0);
                e;
                f += "[" + o + "," + l + ',"255,0,0"]', e < r - 1 && (f += "|")
            }
            var e = "https://www.onemap.gov.sg/api/staticmap/getStaticImage?layerchosen=original&latitude=" + w + "&longitude=" + T + "&points=" + f + "&zoom=16&width=" + A + "&height=" + A,
                e = '<a href="https://maps.google.com/?q=' + w + "," + T + '" target="_blank"><img src=' + e + "></a>";
            document.getElementById("hoodtitle").innerHTML = "<b>📍 Interesting HDBs near " + y + "</b><br><br>", document.getElementById("hoodmapping").innerHTML = e;
            let t = '<span class="instructions">*Transactions shows total number of resale transactions from 1990 to 2022.</span><br>';
            t += '<table id="hoodTable"><tr><th onclick="sortHood(0)">Block</th><th onclick="sortHood(1)">Year</th><th onclick="sortHood(2)">Floors</th><th onclick="sortHood(3)">Units</th><th onclick="sortHood(4)">*Transactions</th></tr>';
            for (let e = 0; e < r; e++) {
                var i, c, d = resultobject[e].Address,
                    h = resultobject[e].Start,
                    u = resultobject[e].MaxFloor,
                    m = resultobject[e].TotalUnits,
                    p = (resultobject[e].Postal, resultobject[e].TransCount),
                    b = resultobject[e].lat,
                    g = resultobject[e].lon;
                d == y ? (t += "<tr><td><b>" + d + "</b></td><td><b>" + h + "</b></td><td><b>" + u + "</b></td><td><b>" + m + "</b></td><td><b>" + p + "</b></td></tr>", c = encodeURIComponent(d), i = '[ <a href="' + ("https://api.whatsapp.com/send?text=https://sgp.fyi/?ref=" + encodeURIComponent(c + "&l1=" + b + "&l2=" + g)) + '" data-action="share/whatsapp/share" target="_blank" >&nbsp;WhatsApp&nbsp;</a> | ', c = '<a href="' + ("mailto:?subject=HDB Resale Transactions for " + d + encodeURIComponent(d) + "&body=https://sgp.fyi/?ref=" + encodeURIComponent(c + "&l1=" + b + "&l2=" + g)) + '" target="_blank" >&nbsp;Email&nbsp;</a> ]', document.getElementById("sharingpanel").innerHTML = "<br>Share 💬 via: &nbsp;", document.getElementById("sharingpanel").innerHTML += i, document.getElementById("sharingpanel").innerHTML += c) : t += "<tr><td><a href='https://sgp.fyi/?ref=" + d + "&l1=" + b + "&l2=" + g + '\' target="_blank">' + d + "</a></td><td>" + h + "</td><td>" + u + "</td><td>" + m + "</td><td>" + p + "</td></tr>"
            }
            t += "</table>", document.getElementById("hoodresults").innerHTML = t
        }
    })
}

// Fetches block information (Lease start year, lease end year, property age, remaining lease, max floor, total units) and updates the UI.
// Calls getHotHood(o) to fetch nearby HDB blocks and update the UI.
// Updates the search address and status.
function getBlockInfo(o) {
    fetch("https://mbq6a85ywi.execute-api.ap-southeast-1.amazonaws.com/getBlockInfo?blkstreet=" + o, {
        method: "GET",
        redirect: "follow"
    }).then(e => e.json()).then(e => resultobject = e).then(() => {
        var e, t, r, a, n, s;
        resultobject && (e = resultobject.leasestart, t = resultobject.maxfloor, r = resultobject.totalunits, a = (s = (new Date).getFullYear()) - e, n = parseInt(e) + 99, s = parseInt(e) + 99 - s, document.getElementById("searchaddress").innerHTML += "Lease: " + e + " to " + n + "<br>Property Age: " + a + " years<br>Remaining Lease: " + s + " years<br>Highest floor: " + t + "<br>Total units: " + r), getHotHood(o), document.getElementById("searchstatus").innerHTML = "<p>Showing results for: </p>", document.getElementById("search").innerHTML = o
    })
}

// Fetches resale transactions for a given HDB block and updates the UI.
// Calls getBlockInfo(g + " " + b) to fetch block information and update the UI.
// Updates the search address and status.
// Creates a chart to visualize the transaction data.
function getTransactions(b, g) {
    const e = document.getElementById("maparea");
    e.scrollIntoView({
        behavior: "smooth"
    });
    var t = "<h3>Address: <b>" + g + " " + b + "</b></h3>",
        y = "Resale transactions for " + g + " " + b;
    document.getElementById("searchaddress").innerHTML = t;
    document.getElementById("transactiongraph").innerHTML = "Getting all transactions on " + g + " " + b + ' <svg aria-hidden="true" width="30" height="30" focusable="false" data-prefix="fas" data-icon="spinner" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-spinner fa-w-16 fa-spin fa-lg"><path fill="currentColor" d="M304 48c0 26.51-21.49 48-48 48s-48-21.49-48-48 21.49-48 48-48 48 21.49 48 48zm-48 368c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm208-208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48 21.49 48-48-21.49-48-48-48zM96 256c0-26.51-21.49-48-48-48S0 229.49 0 256s21.49 48 48 48 48-21.49 48-48zm12.922 99.078c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.491-48-48-48zm294.156 0c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48c0-26.509-21.49-48-48-48zM108.922 60.922c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.491-48-48-48z" class></path></svg>';
    var T, w = new Array,
        f = [];
    new Headers;
    fetch("https://mbq6a85ywi.execute-api.ap-southeast-1.amazonaws.com/getHDBtransactions?st=" + b + "&blk=" + g, {
        method: "GET",
        redirect: "follow"
    }).then(e => e.json()).then(e => T = e).then(() => {
        if (f = T.length, "No results found" == T && (document.getElementById("transactiongraph").innerHTML = "<h3><b>No results found</b></h3><br>Either this is not a HDB unit or no transactions exist for this HDB block yet", f = 0), 0 < f) {
            getBlockInfo(g + " " + b);
            var t = '<button id="buttonx" class="accordion"><b>&nbsp; > Show Transaction Details (' + f + ") 🔍</b></button>";
            t += '<div class="panel"><span class="instructions">Click on any column to sort</span><br><table id="resultTable" width="100%"><tr><th onclick="sortTable(0)">Date</th><th onclick="sortTable(1)">Model</th><th onclick="sortTable(2)">Type</th><th onclick="sortTable(3)">Floor</th><th onclick="sortTable(4)">SqM</th><th onclick="sortTable(5)">S$</th></tr>';
            for (let e = 0; e < f; e++) {
                var r = T[e].FlatModel,
                    a = T[e].FlatType,
                    n = T[e].Price,
                    s = T[e].SizeSQM,
                    o = T[e].StoreyRange,
                    l = T[e].TransDate,
                    i = {
                        Price: n,
                        StoreyRange: o,
                        FlatModel: r,
                        TransDate: l,
                        FlatType: a,
                        SizeSQM: s
                    };
                w.push(i), t += "<tr><td>" + l + "</td><td>" + r + "</td><td>" + a + "</td><td>" + o + "</td><td>" + s + "</td><td> $" + n + "</td></tr>"
            }
            t += "</table></div>", document.getElementById("transactionresults").innerHTML = t, sortTable(0);
            const p = document.getElementById("buttonx");
            p.addEventListener("click", function() {
                let e = this.nextElementSibling;
                "block" === e.style.display ? e.style.display = "none" : e.style.display = "block"
            });
            for (let e = 0; e < w.length; e++) minmaxFinder.push(Number(w[e].Price));
            Array.prototype.max = function() {
                return Math.max.apply(null, this)
            }, Array.prototype.min = function() {
                return Math.min.apply(null, this)
            };
            var c = minmaxFinder.max();
            minmaxFinder.min();
            for (let e = 0; e < w.length; e++) randColoredBubblesArray.push(getRandomColor());
            for (let e = 0; e < w.length; e++) {
                plotArrayX.push(w[e].TransDate), plotArrayY.push(w[e].Price);
                var d = Number(w[e].Price),
                    h = Math.ceil(d / c * 15);
                plotArrayR.push(h);
                var u = Math.ceil(d / (10.7639 * w[e].SizeSQM)),
                    m = w[e].TransDate,
                    d = w[e].Price;
                newEntry = {
                    x: m,
                    y: d,
                    Size: w[e].SizeSQM,
                    PSF: u,
                    StoreyRange: w[e].StoreyRange,
                    FlatType: w[e].FlatType,
                    FlatModel: w[e].FlatModel,
                    r: h
                }, chartArray.push(newEntry)
            }
            document.getElementById("transactiongraph").innerHTML = '<canvas id="myChart" width="400" height="400"></canvas>';
            var e = {
                type: "bubble",
                data: {
                    datasets: [{
                        data: chartArray,
                        backgroundColor: randColoredBubblesArray
                    }]
                },
                options: {
                    plugins: {
                        title: {
                            display: !0,
                            text: y
                        },
                        subtitle: {
                            display: !0,
                            text: "Click on bubble for details"
                        },
                        legend: {
                            display: !1
                        },
                        tooltip: {
                            enabled: !0,
                            callbacks: {
                                label: function(e, t) {
                                    e = e.raw;
                                    return e.x + " | $" + kFormatter(e.y) + " | " + e.StoreyRange + " | " + e.Size + "sqm | $" + e.PSF + "psf | " + e.FlatType + " | " + e.FlatModel
                                }
                            }
                        }
                    },
                    scales: {
                        x: {
                            type: "category",
                            labels: plotArrayX
                        },
                        y: {
                            ticks: {
                                callback: function(e, t, r) {
                                    return "$" + e
                                }
                            }
                        }
                    }
                }
            };
            new Chart(document.getElementById("myChart"), e)
        }
    })
}