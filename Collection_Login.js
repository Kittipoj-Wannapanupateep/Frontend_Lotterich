document.addEventListener('DOMContentLoaded', function() {
    const itemsPerPage = 3;
    const paginationContainer = document.querySelector('.pagination');
    let currentPage = 1;

    // Helper: แปลงวันที่ไทยเป็น Date object (ใช้สำหรับ sort)
    function thaiDateToDate(thaiDate) {
        const [day, month, year] = thaiDate.split('/');
        const ceYear = parseInt(year) - 543;
        return new Date(ceYear, parseInt(month) - 1, parseInt(day));
    }

    // Helper: คืนค่ารายการทั้งหมด (สดใหม่ทุกครั้ง)
    function getAllCollectionItems() {
        return Array.from(document.querySelectorAll('.collection-item'));
    }

    // Function to check and show empty state
    function checkEmptyState() {
        const items = getAllCollectionItems();
        const emptyState = document.querySelector('.empty-state');
        const noResults = document.querySelector('.no-results');
        const searchTerm = document.querySelector('.search-input').value;
        const hasActiveFilters = filterState.status.length < 3 || filterState.prizeTypes.length < 9;

        // If there are no items at all
        if (items.length === 0) {
            emptyState.style.display = 'block';
            noResults.style.display = 'none';
            return;
        }

        // If there's a search term and no items are visible
        if (searchTerm && items.every(item => item.style.display === 'none')) {
            emptyState.style.display = 'none';
            noResults.style.display = 'block';
            noResults.querySelector('h3').textContent = 'ไม่พบเลขสลากที่ค้นหา';
            noResults.querySelector('p').textContent = 'ลองค้นหาเลขสลากอื่น หรือเพิ่มสลากใหม่';
            return;
        }

        // If there are active filters and no items match
        if (hasActiveFilters && items.every(item => item.style.display === 'none')) {
            emptyState.style.display = 'none';
            noResults.style.display = 'block';
            noResults.querySelector('h3').textContent = 'ไม่พบเลขสลากที่ต้องการ';
            noResults.querySelector('p').textContent = 'ลองเปลี่ยนเงื่อนไขการกรอง หรือเพิ่มสลากใหม่';
            return;
        }

        // Default case: hide both messages
        emptyState.style.display = 'none';
        noResults.style.display = 'none';
    }

    // Sort items ด้วยวันที่ (ใหม่ไปเก่า)
    function sortItemsByDate() {
        const container = document.querySelector('.collection-items');
        const items = getAllCollectionItems();
        
        // เรียงตามวันที่จากใหม่ไปเก่า
        const sortedItems = items.sort((a, b) => {
            const dateA = thaiDateToDate(a.querySelector('.collection-date').textContent.replace('วันที่ ', ''));
            const dateB = thaiDateToDate(b.querySelector('.collection-date').textContent.replace('วันที่ ', ''));
            return dateB - dateA; // Descending order (newest first)
        });

        // Clear and re-append sorted items
        container.innerHTML = '';
        // Add back the empty state and no results messages
        container.innerHTML = `
            <div class="empty-state" style="display: none;">
                <div class="empty-state-icon">
                    <i class="fas fa-ticket-alt"></i>
                </div>
                <h3>ขณะนี้ยังไม่มีสลากที่บันทึกไว้</h3>
                <p>เริ่มบันทึกสลากของคุณได้เลย</p>
            </div>
            <div class="no-results" style="display: none;">
                <div class="no-results-icon">
                    <i class="fas fa-search"></i>
                </div>
                <h3>ไม่พบเลขสลากที่ค้นหา</h3>
                <p>ลองค้นหาเลขสลากอื่น หรือเพิ่มสลากใหม่</p>
            </div>
        `;
        sortedItems.forEach(item => container.appendChild(item));
        
        // Check empty state after sorting
        checkEmptyState();
        
        return sortedItems;
    }

    // Filter ตามช่อง search (เลขสลาก)
    function filterItems(searchTerm) {
        const allItems = getAllCollectionItems();
        if (!searchTerm) return allItems;
        
        return allItems.filter(item => {
            const lotteryNumber = item.querySelector('.lottery-number').textContent.toLowerCase();
            return lotteryNumber.includes(searchTerm.toLowerCase());
        });
    }

    // ปรับปรุง filteredItems ตาม search term ปัจจุบัน
    function updateFilteredItems() {
        const searchTerm = document.querySelector('.search-input').value;
        return filterItems(searchTerm);
    }

    // แสดงรายการในหน้าปัจจุบัน
    function showPage(page) {
        // ให้ sort รายการและกรองตาม search ล่าสุดก่อน
        sortItemsByDate();
        const filteredItems = updateFilteredItems();
        
        // กรองรายการตาม filter state
        const filteredAndSearchedItems = filteredItems.filter(item => itemMatchesFilter(item));
        
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        // ซ่อนทุกรายการก่อน
        getAllCollectionItems().forEach(item => {
            item.style.display = 'none';
        });

        // แสดงเฉพาะรายการที่กรองและอยู่ในหน้าปัจจุบัน
        filteredAndSearchedItems
            .slice(startIndex, endIndex)
            .forEach(item => {
                item.style.display = 'flex';
            });

        // Check and show appropriate message
        checkEmptyState();

        // เลื่อนหน้าสุดขึ้นบน
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // สร้างปุ่มเลขหน้า
    function createPageButton(page, isActive) {
        const pageButton = document.createElement('button');
        pageButton.className = `btn ${isActive ? 'btn-primary' : 'btn-outline-primary'}`;
        pageButton.textContent = page;
        pageButton.addEventListener('click', () => {
            currentPage = page;
            showPage(currentPage);
            updatePagination();
        });
        return pageButton;
    }

    // สร้างจุดไข่ปลาสำหรับหน้าที่ไม่แสดง
    function createEllipsis() {
        const ellipsis = document.createElement('span');
        ellipsis.className = 'pagination-ellipsis';
        ellipsis.textContent = '...';
        ellipsis.style.padding = '0 8px';
        return ellipsis;
    }

    // อัปเดต pagination UI
    function updatePagination() {
        // ต้อง sort และ filter ใหม่ทุกครั้ง
        sortItemsByDate();
        const filteredItems = updateFilteredItems();
        
        // กรองรายการตาม filter state
        const filteredAndSearchedItems = filteredItems.filter(item => itemMatchesFilter(item));
        
        const totalPages = Math.ceil(filteredAndSearchedItems.length / itemsPerPage);
        paginationContainer.innerHTML = '';

        // ปรับ currentPage หากเกินจำนวนหน้า
        if (currentPage > totalPages && totalPages > 0) {
            currentPage = totalPages;
            showPage(currentPage);
        }

        // ไม่มีหน้าให้แสดง
        if (totalPages === 0) {
            return;
        }

        // ปุ่ม Previous
        if (totalPages > 1 && currentPage > 1) {
            const prevButton = document.createElement('button');
            prevButton.className = 'btn btn-outline-primary';
            prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
            prevButton.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    showPage(currentPage);
                    updatePagination();
                }
            });
            paginationContainer.appendChild(prevButton);
        }

        // แสดงหน้าแรกเสมอ
        paginationContainer.appendChild(createPageButton(1, currentPage === 1));

        if (totalPages > 5) {
            if (currentPage <= 3) {
                // Show 2, 3, 4, ..., last
                for (let i = 2; i <= 4 && i <= totalPages; i++) {
                    paginationContainer.appendChild(createPageButton(i, currentPage === i));
                }
                if (totalPages > 4) {
                    paginationContainer.appendChild(createEllipsis());
                    paginationContainer.appendChild(createPageButton(totalPages, currentPage === totalPages));
                }
            } else if (currentPage >= totalPages - 2) {
                // Show first, ..., last-3, last-2, last-1, last
                paginationContainer.appendChild(createEllipsis());
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    if (i > 1) {
                        paginationContainer.appendChild(createPageButton(i, currentPage === i));
                    }
                }
            } else {
                // Show first, ..., current-1, current, current+1, ..., last
                paginationContainer.appendChild(createEllipsis());
                paginationContainer.appendChild(createPageButton(currentPage - 1, false));
                paginationContainer.appendChild(createPageButton(currentPage, true));
                paginationContainer.appendChild(createPageButton(currentPage + 1, false));
                paginationContainer.appendChild(createEllipsis());
                paginationContainer.appendChild(createPageButton(totalPages, currentPage === totalPages));
            }
        } else {
            // Show all pages if less than or equal to 5
            for (let i = 2; i <= totalPages; i++) {
                paginationContainer.appendChild(createPageButton(i, currentPage === i));
            }
        }

        // ปุ่ม Next
        if (totalPages > 1 && currentPage < totalPages) {
            const nextButton = document.createElement('button');
            nextButton.className = 'btn btn-outline-primary';
            nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
            nextButton.addEventListener('click', () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    showPage(currentPage);
                    updatePagination();
                }
            });
            paginationContainer.appendChild(nextButton);
        }
    }

    // Initialize Bootstrap modals
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    const deleteConfirmModal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
    const deleteSuccessModal = new bootstrap.Modal(document.getElementById('deleteSuccessModal'));
    const addModal = new bootstrap.Modal(document.getElementById('addModal'));
    const filterModal = new bootstrap.Modal(document.getElementById('filterModal'));
    let currentItem = null;

    // Filter state
    let filterState = {
        status: ['pending', 'no', 'yes'],
        prizeTypes: ['last2', 'last3', 'first3', 'prize5', 'prize4', 'prize3', 'prize2', 'near1', 'prize1']
    };

    // Handle filter button click
    document.querySelector('.filter-button').addEventListener('click', function() {
        // Update checkboxes based on current filter state
        document.getElementById('filterPending').checked = filterState.status.includes('pending');
        document.getElementById('filterNo').checked = filterState.status.includes('no');
        document.getElementById('filterYes').checked = filterState.status.includes('yes');
        
        document.getElementById('filterLast2').checked = filterState.prizeTypes.includes('last2');
        document.getElementById('filterLast3').checked = filterState.prizeTypes.includes('last3');
        document.getElementById('filterFirst3').checked = filterState.prizeTypes.includes('first3');
        document.getElementById('filterPrize5').checked = filterState.prizeTypes.includes('prize5');
        document.getElementById('filterPrize4').checked = filterState.prizeTypes.includes('prize4');
        document.getElementById('filterPrize3').checked = filterState.prizeTypes.includes('prize3');
        document.getElementById('filterPrize2').checked = filterState.prizeTypes.includes('prize2');
        document.getElementById('filterNear1').checked = filterState.prizeTypes.includes('near1');
        document.getElementById('filterPrize1').checked = filterState.prizeTypes.includes('prize1');

        // Show/hide prize type filter based on "ถูกรางวัล" selection
        document.getElementById('prizeTypeFilterContainer').style.display = 
            document.getElementById('filterYes').checked ? 'block' : 'none';

        filterModal.show();
    });

    // Handle "ถูกรางวัล" checkbox change
    document.getElementById('filterYes').addEventListener('change', function() {
        document.getElementById('prizeTypeFilterContainer').style.display = 
            this.checked ? 'block' : 'none';
    });

    // Handle reset filter button
    document.getElementById('resetFilter').addEventListener('click', function() {
        // Reset all checkboxes to checked
        document.querySelectorAll('#filterForm input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = true;
        });
        
        // Show prize type filter
        document.getElementById('prizeTypeFilterContainer').style.display = 'block';
    });

    // Handle apply filter button
    document.getElementById('applyFilter').addEventListener('click', function() {
        // Update filter state
        filterState.status = [];
        if (document.getElementById('filterPending').checked) filterState.status.push('pending');
        if (document.getElementById('filterNo').checked) filterState.status.push('no');
        if (document.getElementById('filterYes').checked) filterState.status.push('yes');

        filterState.prizeTypes = [];
        if (document.getElementById('filterLast2').checked) filterState.prizeTypes.push('last2');
        if (document.getElementById('filterLast3').checked) filterState.prizeTypes.push('last3');
        if (document.getElementById('filterFirst3').checked) filterState.prizeTypes.push('first3');
        if (document.getElementById('filterPrize5').checked) filterState.prizeTypes.push('prize5');
        if (document.getElementById('filterPrize4').checked) filterState.prizeTypes.push('prize4');
        if (document.getElementById('filterPrize3').checked) filterState.prizeTypes.push('prize3');
        if (document.getElementById('filterPrize2').checked) filterState.prizeTypes.push('prize2');
        if (document.getElementById('filterNear1').checked) filterState.prizeTypes.push('near1');
        if (document.getElementById('filterPrize1').checked) filterState.prizeTypes.push('prize1');

        // Close modal
        filterModal.hide();

        // Apply filter and update view
        currentPage = 1;
        showPage(currentPage);
        updatePagination();
    });

    // Function to check if item matches filter
    function itemMatchesFilter(item) {
        const prizeStatusText = item.querySelector('.prize-status').textContent;
        let status = 'no';
        let prizeType = '';

        if (prizeStatusText === 'ยังไม่ประกาศรางวัล') {
            status = 'pending';
        } else if (prizeStatusText.startsWith('ถูกรางวัล')) {
            status = 'yes';
            const prizeTypeMatch = prizeStatusText.match(/\((.*?)\)/);
            if (prizeTypeMatch) {
                const prizeTypeText = prizeTypeMatch[1];
                const prizeTypes = {
                    'สองตัวท้าย': 'last2',
                    'สามตัวท้าย': 'last3',
                    'สามตัวหน้า': 'first3',
                    'รางวัลที่ 5': 'prize5',
                    'รางวัลที่ 4': 'prize4',
                    'รางวัลที่ 3': 'prize3',
                    'รางวัลที่ 2': 'prize2',
                    'รางวัลข้างเคียงที่ 1': 'near1',
                    'รางวัลที่ 1': 'prize1'
                };
                prizeType = prizeTypes[prizeTypeText] || '';
            }
        }

        // Check if status matches filter
        if (!filterState.status.includes(status)) {
            return false;
        }

        // If status is 'yes', check if prize type matches filter
        if (status === 'yes' && !filterState.prizeTypes.includes(prizeType)) {
            return false;
        }

        return true;
    }

    // Add validation messages
    const lotteryNumberInput = document.getElementById('lotteryNumber');
    const ticketCountInput = document.getElementById('ticketCount');
    const ticketPriceInput = document.getElementById('ticketPrice');
    const purchaseDateInput = document.getElementById('purchaseDate');
    const addLotteryNumberInput = document.getElementById('addLotteryNumber');
    const addTicketCountInput = document.getElementById('addTicketCount');
    const addTicketPriceInput = document.getElementById('addTicketPrice');
    const addPurchaseDateInput = document.getElementById('addPurchaseDate');
    const prizeStatusInput = document.getElementById('prizeStatus');
    const prizeTypeInput = document.getElementById('prizeType');
    const prizeTypeContainer = document.getElementById('prizeTypeContainer');
    const winningNumberInput = document.getElementById('winningNumber');
    const winningNumberContainer = document.getElementById('winningNumberContainer');
    const addPrizeStatusInput = document.getElementById('addPrizeStatus');
    const addPrizeTypeInput = document.getElementById('addPrizeType');
    const addPrizeTypeContainer = document.getElementById('addPrizeTypeContainer');
    const addWinningNumberInput = document.getElementById('addWinningNumber');
    const addWinningNumberContainer = document.getElementById('addWinningNumberContainer');

    // Function to calculate similarity percentage
    function calculateSimilarity(lotteryNumber, winningNumber) {
        if (!winningNumber || winningNumber.length !== 6) return 0;
        
        let matches = 0;
        for (let i = 0; i < 6; i++) {
            if (lotteryNumber[i] === winningNumber[i]) {
                matches++;
            }
        }
        return Math.round((matches / 6) * 100);
    }

    // Handle prize status change for edit modal
    prizeStatusInput.addEventListener('change', function() {
        const isPending = this.value === 'pending';
        const isWon = this.value === 'yes';
        prizeTypeContainer.style.display = isWon ? 'block' : 'none';
        winningNumberContainer.style.display = (!isPending) ? 'block' : 'none';
    });

    // Handle prize status change for add modal
    addPrizeStatusInput.addEventListener('change', function() {
        const isPending = this.value === 'pending';
        const isWon = this.value === 'yes';
        addPrizeTypeContainer.style.display = isWon ? 'block' : 'none';
        addWinningNumberContainer.style.display = (!isPending) ? 'block' : 'none';
    });

    // Function to extract winning number from status text
    function extractWinningNumber(statusText) {
        // If the text contains similarity information, try to extract the winning number
        if (statusText.includes('ใกล้เคียง')) {
            // First try to find the winning number in the text
            const winningNumberMatch = statusText.match(/รางวัลที่ 1 (\d{6})/);
            if (winningNumberMatch) {
                return winningNumberMatch[1];
            }
        }
        return '';
    }

    // Function to get prize status text with similarity
    function getPrizeStatusText(status, prizeType, lotteryNumber, winningNumber) {
        const similarity = calculateSimilarity(lotteryNumber, winningNumber);
        let statusText = '';
        
        switch(status) {
            case 'pending':
                return 'ยังไม่ประกาศรางวัล';
            case 'no':
                statusText = 'ไม่ถูกรางวัล';
                return statusText;
            case 'yes':
                statusText = `ถูกรางวัล (${getPrizeTypeText(prizeType)})`;
                return statusText;
            default:
                return 'ไม่ถูกรางวัล';
        }
    }

    // Function to get similarity text
    function getSimilarityText(lotteryNumber, winningNumber) {
        if (winningNumber && winningNumber.length === 6) {
            const similarity = calculateSimilarity(lotteryNumber, winningNumber);
            return `ใกล้เคียงกับรางวัลที่ 1 : ${similarity}%`;
        }
        return '';
    }

    // Function to update similarity box visibility
    function updateSimilarityBox(item, lotteryNumber, winningNumber) {
        const similarityBox = item.querySelector('.similarity-box');
        const similarityText = getSimilarityText(lotteryNumber, winningNumber);
        
        if (similarityText) {
            similarityBox.classList.add('has-similarity');
            similarityBox.querySelector('.similarity').textContent = similarityText;
        } else {
            similarityBox.classList.remove('has-similarity');
            similarityBox.querySelector('.similarity').textContent = '';
        }
    }

    // Function to get prize type text
    function getPrizeTypeText(prizeType) {
        const prizeTypes = {
            'last2': 'สองตัวท้าย',
            'last3': 'สามตัวท้าย',
            'first3': 'สามตัวหน้า',
            'prize5': 'รางวัลที่ 5',
            'prize4': 'รางวัลที่ 4',
            'prize3': 'รางวัลที่ 3',
            'prize2': 'รางวัลที่ 2',
            'near1': 'รางวัลข้างเคียงที่ 1',
            'prize1': 'รางวัลที่ 1'
        };
        return prizeTypes[prizeType] || '';
    }

    // Function to get status strip color
    function getStatusStripColor(status) {
        switch(status) {
            case 'pending':
                return '#6e6e6e'; // Gray for pending
            case 'yes':
                return '#ffc107'; // Yellow for won
            case 'no':
                return '#ff0000'; // Red for not won
            default:
                return '#6e6e6e';
        }
    }

    // Function to format price
    function formatPrice(price) {
        return price ? `฿${price.toLocaleString()}` : '';
    }

    // Function to get total price text
    function getTotalPriceText(count, price) {
        if (count && price) {
            const total = count * price;
            return `จำนวน ${count} ใบ (${formatPrice(price)}/ใบ)`;
        }
        return `จำนวน ${count} ใบ`;
    }

    // Create error message elements
    const lotteryError = document.createElement('div');
    lotteryError.className = 'invalid-feedback';
    lotteryError.textContent = 'กรุณากรอกเลขสลาก 6 หลัก';
    lotteryNumberInput.parentNode.appendChild(lotteryError);

    const ticketCountError = document.createElement('div');
    ticketCountError.className = 'invalid-feedback';
    ticketCountError.textContent = 'กรุณากรอกจำนวนที่ซื้ออย่างน้อย 1 ใบ';
    ticketCountInput.parentNode.appendChild(ticketCountError);

    // Validation for lottery number (edit form)
    lotteryNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '').slice(0, 6);
        e.target.value = value;

        if (value.length !== 6) {
            lotteryNumberInput.classList.add('is-invalid');
        } else {
            lotteryNumberInput.classList.remove('is-invalid');
        }
    });

    // Validation for ticket count (edit form)
    ticketCountInput.addEventListener('input', function(e) {
        const value = parseInt(e.target.value);
        if (!e.target.value || value < 1) {
            ticketCountInput.classList.add('is-invalid');
        } else {
            ticketCountInput.classList.remove('is-invalid');
        }
    });

    // Validation for lottery number (add form)
    addLotteryNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '').slice(0, 6);
        e.target.value = value;

        if (value.length !== 6) {
            addLotteryNumberInput.classList.add('is-invalid');
            addLotteryNumberInput.parentElement.querySelector('.invalid-feedback').style.display = 'block';
        } else {
            addLotteryNumberInput.classList.remove('is-invalid');
            addLotteryNumberInput.parentElement.querySelector('.invalid-feedback').style.display = 'none';
        }
    });

    // Validation for ticket count (add form)
    addTicketCountInput.addEventListener('input', function(e) {
        const value = parseInt(e.target.value);
        if (!e.target.value || value < 1) {
            addTicketCountInput.classList.add('is-invalid');
            addTicketCountInput.parentElement.querySelector('.invalid-feedback').style.display = 'block';
        } else {
            addTicketCountInput.classList.remove('is-invalid');
            addTicketCountInput.parentElement.querySelector('.invalid-feedback').style.display = 'none';
        }
    });

    // Validate winning number input
    winningNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '').slice(0, 6);
        e.target.value = value;
        
        if (value.length !== 6 && value.length > 0) {
            this.classList.add('is-invalid');
        } else {
            this.classList.remove('is-invalid');
        }
    });

    // Validate add winning number input
    addWinningNumberInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '').slice(0, 6);
        e.target.value = value;
        
        if (value.length !== 6 && value.length > 0) {
            this.classList.add('is-invalid');
        } else {
            this.classList.remove('is-invalid');
        }
    });

    // Validation for ticket price (edit form)
    ticketPriceInput.addEventListener('input', function(e) {
        const value = parseFloat(e.target.value);
        if (value < 0) {
            e.target.value = 0;
        }
    });

    // Validation for ticket price (add form)
    addTicketPriceInput.addEventListener('input', function(e) {
        const value = parseFloat(e.target.value);
        if (value < 0) {
            e.target.value = 0;
        }
    });

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    const clearSearchBtn = document.querySelector('.clear-search-btn');

    // Show/hide clear button based on input value
    searchInput.addEventListener('input', function(e) {
        clearSearchBtn.style.display = this.value ? 'flex' : 'none';
        
        // เมื่อ search เปลี่ยน ให้รีเซ็ตเป็นหน้าแรกเสมอ
        currentPage = 1;
        showPage(currentPage);
        updatePagination();
        // Check empty state after search
        checkEmptyState();
    });

    // Clear search input when clear button is clicked
    clearSearchBtn.addEventListener('click', function() {
        searchInput.value = '';
        clearSearchBtn.style.display = 'none';
        currentPage = 1;
        showPage(currentPage);
        updatePagination();
        checkEmptyState();
    });

    // Bind event listeners to all edit buttons
    function bindEditButtons() {
        document.querySelectorAll('.btn-edit').forEach(button => {
            button.addEventListener('click', function() {
                // Get the parent collection item
                const item = this.closest('.collection-item');
                currentItem = item;

                // Get current values
                const lotteryNumber = item.querySelector('.lottery-number').textContent.replace('เลข ', '');
                const ticketCountText = item.querySelector('.ticket-count').textContent;
                const ticketCount = parseInt(ticketCountText.match(/จำนวน (\d+) ใบ/)[1]);
                const ticketPrice = parseFloat(item.dataset.ticketPrice) || 0;
                const prizeStatusText = item.querySelector('.prize-status').textContent;
                const purchaseDate = item.querySelector('.collection-date').textContent.replace('วันที่ ', '');
                const winningNumber = item.dataset.winningNumber || '';

                // Convert Thai date to ISO format for date input
                const [day, month, year] = purchaseDate.split('/');
                const ceYear = parseInt(year) - 543;
                const isoDate = `${ceYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

                // Determine prize status and type from the text
                let prizeStatus = 'no';
                let prizeType = 'last2'; // Default value
                
                if (prizeStatusText === 'ยังไม่ประกาศรางวัล') {
                    prizeStatus = 'pending';
                } else if (prizeStatusText.startsWith('ถูกรางวัล')) {
                    prizeStatus = 'yes';
                    // Extract prize type from the text
                    const prizeTypeMatch = prizeStatusText.match(/\((.*?)\)/);
                    if (prizeTypeMatch) {
                        const prizeTypeText = prizeTypeMatch[1];
                        // Convert Thai prize type text to value
                        const prizeTypes = {
                            'สองตัวท้าย': 'last2',
                            'สามตัวท้าย': 'last3',
                            'สามตัวหน้า': 'first3',
                            'รางวัลที่ 5': 'prize5',
                            'รางวัลที่ 4': 'prize4',
                            'รางวัลที่ 3': 'prize3',
                            'รางวัลที่ 2': 'prize2',
                            'รางวัลข้างเคียงที่ 1': 'near1',
                            'รางวัลที่ 1': 'prize1'
                        };
                        prizeType = prizeTypes[prizeTypeText] || 'last2';
                    }
                }

                // Populate form with current values
                document.getElementById('lotteryNumber').value = lotteryNumber;
                document.getElementById('ticketCount').value = ticketCount;
                document.getElementById('ticketPrice').value = ticketPrice;
                document.getElementById('purchaseDate').value = isoDate;
                document.getElementById('prizeStatus').value = prizeStatus;
                document.getElementById('prizeType').value = prizeType;
                document.getElementById('winningNumber').value = winningNumber;

                // Show/hide prize type and winning number containers based on prize status
                const isPending = prizeStatus === 'pending';
                const isWon = prizeStatus === 'yes';
                prizeTypeContainer.style.display = isWon ? 'block' : 'none';
                winningNumberContainer.style.display = (!isPending) ? 'block' : 'none';

                // Reset error states
                lotteryNumberInput.classList.remove('is-invalid');
                ticketCountInput.classList.remove('is-invalid');
                winningNumberInput.classList.remove('is-invalid');

                // Show modal
                editModal.show();
            });
        });
    }

    // Bind event listeners to all delete buttons
    function bindDeleteButtons() {
        document.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', function() {
                currentItem = this.closest('.collection-item');
                deleteConfirmModal.show();
            });
        });
    }

    // Bind all buttons initially
    bindEditButtons();
    bindDeleteButtons();

    // Reset validation states when edit modal is closed
    document.getElementById('editModal').addEventListener('hidden.bs.modal', function() {
        lotteryNumberInput.classList.remove('is-invalid');
        ticketCountInput.classList.remove('is-invalid');
        winningNumberInput.classList.remove('is-invalid');
    });

    // Handle confirm edit button click
    document.getElementById('confirmEdit').addEventListener('click', function() {
        const lotteryNumber = lotteryNumberInput.value;
        const ticketCount = parseInt(ticketCountInput.value);
        const ticketPrice = Math.max(0, parseFloat(ticketPriceInput.value) || 0);
        let purchaseDate = purchaseDateInput.value;
        const prizeStatus = prizeStatusInput.value;
        const prizeType = prizeTypeInput.value;
        const winningNumber = winningNumberInput.value;
        
        // Validate lottery number
        if (lotteryNumber.length !== 6) {
            lotteryNumberInput.classList.add('is-invalid');
            return;
        }

        // Validate ticket count
        if (!ticketCount || ticketCount < 1) {
            ticketCountInput.classList.add('is-invalid');
            return;
        }

        // Validate winning number if provided
        if (winningNumber && winningNumber.length !== 6) {
            winningNumberInput.classList.add('is-invalid');
            return;
        }

        // Set default date to current date if not selected
        if (!purchaseDate) {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            purchaseDate = `${year}-${month}-${day}`;
            purchaseDateInput.value = purchaseDate;
        }

        if (!currentItem) return;

        // Convert ISO date to Thai format
        const [year, month, day] = purchaseDate.split('-');
        const beYear = parseInt(year) + 543;
        const thaiDate = `${day}/${month}/${beYear}`;

        // Update the item with new values
        currentItem.querySelector('.lottery-number').textContent = `เลข ${lotteryNumber}`;
        currentItem.querySelector('.ticket-count').textContent = getTotalPriceText(ticketCount, ticketPrice);
        currentItem.querySelector('.prize-status').textContent = getPrizeStatusText(prizeStatus, prizeType, lotteryNumber, winningNumber);
        currentItem.querySelector('.collection-date').textContent = `วันที่ ${thaiDate}`;

        // Store winning number and price in data attributes
        currentItem.dataset.winningNumber = winningNumber;
        currentItem.dataset.ticketPrice = ticketPrice;

        // Update similarity box
        updateSimilarityBox(currentItem, lotteryNumber, winningNumber);

        // Update status strip color
        const statusStrip = currentItem.querySelector('.left-collection');
        statusStrip.style.backgroundColor = getStatusStripColor(prizeStatus);

        // Hide edit modal and show success modal
        editModal.hide();
        
        // Update success message for edit
        const successModalTitle = document.querySelector('#successModal .modal-title');
        const successModalMessage = document.querySelector('#successModal .modal-body p');
        successModalTitle.textContent = 'แก้ไขข้อมูลสำเร็จ';
        successModalMessage.textContent = 'ข้อมูลสลากของคุณได้รับการแก้ไขเรียบร้อยแล้ว';
        
        successModal.show();

        // Re-sort items after editing and update pagination
        sortItemsByDate();
        showPage(currentPage);
        updatePagination();
    });

    // Handle delete confirmation
    document.getElementById('confirmDelete').addEventListener('click', function() {
        if (!currentItem) return;
        
        // Remove the item from the DOM
        currentItem.remove();
        
        // Reset currentItem
        currentItem = null;
        
        // Re-sort remaining items and update pagination
        sortItemsByDate();
        showPage(currentPage);
        updatePagination();
        
        // Show success message
        deleteConfirmModal.hide();
        deleteSuccessModal.show();
    });

    // Handle add button click
    document.querySelector('.add-button').addEventListener('click', function() {
        // Reset form
        document.getElementById('addForm').reset();
        
        // Clear validation states
        addLotteryNumberInput.classList.remove('is-invalid');
        addTicketCountInput.classList.remove('is-invalid');
        addWinningNumberInput.classList.remove('is-invalid');
        
        // Hide all invalid feedback messages
        document.querySelectorAll('#addForm .invalid-feedback').forEach(feedback => {
            feedback.style.display = 'none';
        });
        
        // Set default date to current date
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        addPurchaseDateInput.value = `${year}-${month}-${day}`;
        
        // Set default price to 100
        addTicketPriceInput.value = '100';
        
        // Hide prize type and winning number containers by default
        addPrizeTypeContainer.style.display = 'none';
        addWinningNumberContainer.style.display = 'none';
        
        // Show modal
        addModal.show();
    });

    // Handle confirm add button click
    document.getElementById('confirmAdd').addEventListener('click', function() {
        const lotteryNumber = addLotteryNumberInput.value;
        const ticketCount = parseInt(addTicketCountInput.value);
        const ticketPrice = Math.max(0, parseFloat(addTicketPriceInput.value) || 0);
        let purchaseDate = addPurchaseDateInput.value;
        const prizeStatus = addPrizeStatusInput.value;
        const prizeType = addPrizeTypeInput.value;
        const winningNumber = addWinningNumberInput.value;
        
        let hasError = false;
        
        // Validate lottery number
        if (!lotteryNumber || lotteryNumber.length !== 6) {
            addLotteryNumberInput.classList.add('is-invalid');
            addLotteryNumberInput.parentElement.querySelector('.invalid-feedback').style.display = 'block';
            hasError = true;
        } else {
            addLotteryNumberInput.classList.remove('is-invalid');
            addLotteryNumberInput.parentElement.querySelector('.invalid-feedback').style.display = 'none';
        }

        // Validate ticket count
        if (!ticketCount || ticketCount < 1) {
            addTicketCountInput.classList.add('is-invalid');
            addTicketCountInput.parentElement.querySelector('.invalid-feedback').style.display = 'block';
            hasError = true;
        } else {
            addTicketCountInput.classList.remove('is-invalid');
            addTicketCountInput.parentElement.querySelector('.invalid-feedback').style.display = 'none';
        }

        // Validate winning number if provided
        if (winningNumber && winningNumber.length !== 6) {
            addWinningNumberInput.classList.add('is-invalid');
            addWinningNumberInput.parentElement.querySelector('.invalid-feedback').style.display = 'block';
            hasError = true;
        } else {
            addWinningNumberInput.classList.remove('is-invalid');
            addWinningNumberInput.parentElement.querySelector('.invalid-feedback').style.display = 'none';
        }

        // If there are any errors, stop the submission
        if (hasError) {
            return;
        }

        // Set default date to current date if not selected
        if (!purchaseDate) {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            purchaseDate = `${year}-${month}-${day}`;
            addPurchaseDateInput.value = purchaseDate;
        }

        // Convert ISO date to Thai format
        const [year, month, day] = purchaseDate.split('-');
        const beYear = parseInt(year) + 543;
        const thaiDate = `${day}/${month}/${beYear}`;

        // Create new item
        const container = document.querySelector('.collection-items');
        const newItem = document.createElement('div');
        newItem.className = 'collection-item';
        newItem.innerHTML = `
            <div class="left-collection" style="background-color: ${getStatusStripColor(prizeStatus)}"></div>
            <div class="middle-collection">
                <div class="lottery-number">เลข ${lotteryNumber}</div>
                <div class="lottery-details">
                    <div class="detail-box ticket-count-box">
                        <span class="ticket-count">${getTotalPriceText(ticketCount, ticketPrice)}</span>
                    </div>
                    <div class="detail-box prize-status-box">
                        <span class="prize-status">${getPrizeStatusText(prizeStatus, prizeType, lotteryNumber, winningNumber)}</span>
                    </div>
                    <div class="detail-box similarity-box">
                        <span class="similarity"></span>
                    </div>
                </div>
            </div>
            <div class="right-collection">
                <div class="collection-actions">
                    <button class="btn-edit"><i class="fas fa-pencil-alt"></i></button>
                    <button class="btn-delete"><i class="fas fa-trash-alt"></i></button>
                </div>
                <div class="collection-date">วันที่ ${thaiDate}</div>
            </div>
        `;

        // Store winning number and price in data attributes
        newItem.dataset.winningNumber = winningNumber;
        newItem.dataset.ticketPrice = ticketPrice;

        // Update similarity box
        updateSimilarityBox(newItem, lotteryNumber, winningNumber);

        // Add new item to container
        container.appendChild(newItem);

        // Bind event listeners to new buttons
        bindEditButtons();
        bindDeleteButtons();

        // Hide add modal and show success modal
        addModal.hide();
        
        // Update success message for add
        const successModalTitle = document.querySelector('#successModal .modal-title');
        const successModalMessage = document.querySelector('#successModal .modal-body p');
        successModalTitle.textContent = 'เพิ่มข้อมูลสลากสำเร็จ';
        successModalMessage.textContent = 'ข้อมูลสลากของคุณได้รับการเพิ่มเรียบร้อยแล้ว';
        
        successModal.show();

        // เมื่อเพิ่มรายการใหม่ จะได้เห็นรายการในหน้าแรกเสมอ (เพราะต้องเรียงตามวันที่)
        currentPage = 1;

        // Re-sort items (including the new one) and update pagination
        sortItemsByDate();
        showPage(currentPage);
        updatePagination();
    });

    // เริ่มต้น: เรียงตามวันที่และแสดงหน้าแรก
    sortItemsByDate();
    showPage(currentPage);
    updatePagination();
});