document.addEventListener('DOMContentLoaded', () => {
	initCharts();
	setupMobileMenu();
	setupProjectFiltering();
});

function initCharts() {
	const chartElement = document.getElementById('skillsChart');
	if (!chartElement) {
		return;
	}

	const ctx = chartElement.getContext('2d');
	try {
		new Chart(ctx, {
			type: 'radar',
			data: {
				labels: ['Programming', 'AI/ML', 'Web Dev', 'CS Fundamentals', 'Tools', 'Soft Skills'],
				datasets: [{
					label: 'Proficiency Level',
					data: [90, 85, 75, 80, 85, 90],
					backgroundColor: 'rgba(217, 119, 6, 0.2)',
					borderColor: 'rgba(217, 119, 6, 1)',
					pointBackgroundColor: 'rgba(217, 119, 6, 1)',
					pointBorderColor: '#fff',
					pointHoverBackgroundColor: '#fff',
					pointHoverBorderColor: 'rgba(217, 119, 6, 1)'
				}]
			},
			options: {
				maintainAspectRatio: false,
				scales: {
					r: {
						angleLines: { display: true },
						suggestedMin: 0,
						suggestedMax: 100,
						ticks: { display: false }
					}
				},
				plugins: {
					legend: { display: false }
				}
			}
		});
	} catch (error) {
		console.error('Chart.js initialization failed:', error);
	}
}

function setupMobileMenu() {
	const btn = document.getElementById('mobile-menu-btn');
	const menu = document.getElementById('mobile-menu');

	if (!btn || !menu) {
		return;
	}

	const closeMenu = () => {
		menu.classList.add('hidden');
		btn.setAttribute('aria-expanded', 'false');
		btn.textContent = '☰';
	};

	const openMenu = () => {
		menu.classList.remove('hidden');
		btn.setAttribute('aria-expanded', 'true');
		btn.textContent = 'X';
	};

	btn.addEventListener('click', () => {
		if (menu.classList.contains('hidden')) {
			openMenu();
		} else {
			closeMenu();
		}
	});

	menu.querySelectorAll('a').forEach(link => {
		link.addEventListener('click', closeMenu);
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') {
			closeMenu();
		}
	});
}

function filterProjects(category) {
	const cards = document.querySelectorAll('.project-card');
	const buttons = document.querySelectorAll('#projectFilters button');

	buttons.forEach(btn => {
		const isActive = btn.dataset.category === category;
		btn.classList.toggle('filter-btn-active', isActive);
		btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
	});

	cards.forEach(card => {
		const matches = category === 'all' || card.getAttribute('data-category') === category;
		card.style.display = matches ? 'block' : 'none';
	});
}

function setupProjectFiltering() {
	const buttons = document.querySelectorAll('#projectFilters button');

	buttons.forEach(btn => {
		btn.addEventListener('click', () => filterProjects(btn.dataset.category || 'all'));
	});

	filterProjects('all');
}
